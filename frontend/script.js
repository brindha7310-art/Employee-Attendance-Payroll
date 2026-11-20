
let employees = [];
let attendanceRecords = [];

let editingIndex = -1;
let editingEmployeeId = null;
let editingAttendanceId = null;
let appInitialized = false;

const EMPLOYEE_API = "http://localhost:8080/api/employees";
const ATTENDANCE_API = "http://localhost:8080/api/attendance";


// =====================================
// COMMON FUNCTIONS
// =====================================

function getTodayDate()
{
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatCurrency(amount)
{
    return "₹" + Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


async function getResponseData(response)
{
    if (!response.ok)
    {
        const errorText = await response.text();

        throw new Error(errorText || `Request failed: ${response.status}`);
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
}


function escapeHTML(value)
{
    return String(value ?? "").replace(/[&<>"']/g, function(character)
    {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}


// =====================================
// LOGIN AND LOGOUT
// =====================================

function login(event)
{
    event.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    const loginError = document.getElementById("loginError");

    if (username === "admin" && password === "admin123")
    {
        loginError.textContent = "";

        sessionStorage.setItem("payrollLoggedIn", "true");

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("appLayout").style.display = "flex";

        initializeApp();
    }
    else
    {
        loginError.textContent = "Invalid username or password!";
    }
}


function logout()
{
    if (!confirm("Are you sure you want to logout?"))
    {
        return;
    }

    sessionStorage.removeItem("payrollLoggedIn");

    document.getElementById("appLayout").style.display = "none";
    document.getElementById("loginPage").style.display = "flex";

    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";
    document.getElementById("loginError").textContent = "";

    appInitialized = false;
}


// =====================================
// NAVIGATION
// =====================================

function showSection(sectionName)
{
    const sectionNames = [
        "dashboard",
        "employees",
        "attendance",
        "payroll",
        "reports"
    ];

    sectionNames.forEach(function(name)
    {
        const section = document.getElementById(name);

        if (section)
        {
            section.style.display =
                name === sectionName ? "block" : "none";
        }
    });

    document.querySelectorAll(".nav-link").forEach(function(link)
    {
        link.classList.remove("active");

        const linkSection = link.getAttribute("href").replace("#", "");

        if (linkSection === sectionName)
        {
            link.classList.add("active");
        }
    });

    const headings = {
        dashboard: "Dashboard Overview",
        employees: "Employee Management",
        attendance: "Attendance Management",
        payroll: "Payroll Management",
        reports: "Reports & Analytics"
    };

    const heading = document.querySelector(".topbar h1");

    if (heading)
    {
        heading.textContent = headings[sectionName] || "Employee Management";
    }

    if (sectionName === "payroll")
    {
        updatePayroll();
    }

    if (sectionName === "reports")
    {
        updateReports();
        updateDateReport();
        updateEmployeeReport();
    }
}


function setupNavigation()
{
    document.querySelectorAll(".nav-link").forEach(function(link)
    {
        link.addEventListener("click", function(event)
        {
            event.preventDefault();

            const sectionName = link.getAttribute("href").replace("#", "");

            showSection(sectionName);
        });
    });

    showSection("dashboard");
}


// =====================================
// LOAD EMPLOYEES
// =====================================

async function loadEmployees()
{
    try
    {
        const response = await fetch(EMPLOYEE_API);

        employees = await getResponseData(response) || [];

        displayEmployees();
        updateEmployeeDropdowns();
        updateDashboard();
    }
    catch (error)
    {
        console.error("Employee loading error:", error);

        alert("Unable to load employees. Check whether the backend is running.");
    }
}


// =====================================
// ADD EMPLOYEE
// =====================================


async function addEmployee()
{
    const id = document.getElementById("empId").value.trim();
    const name = document.getElementById("empName").value.trim();
    const department = document.getElementById("department").value.trim();
    const designation = document.getElementById("designation").value.trim();
    const salary = Number(document.getElementById("salary").value);

    if (!id || !name || !department || !designation || !salary)
    {
        alert("Please fill all employee details.");
        return;
    }

    if (salary <= 0)
    {
        alert("Salary must be greater than zero.");
        return;
    }

    if (employees.some(employee => employee.id === id))
    {
        alert("Employee ID already exists.");
        return;
    }

    const employee = {
        id: id,
        name: name,
        department: department,
        designation: designation,
        salary: salary
    };

    try
    {
        const response = await fetch(EMPLOYEE_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        });

        await getResponseData(response);

        alert("Employee added successfully!");

        clearEmployeeForm();

        await loadEmployees();

        updatePayroll();
        updateReports();
    }
    catch (error)
    {
        console.error("Add employee error:", error);

        alert("Unable to add employee.");
    }
}


// =====================================
// DISPLAY EMPLOYEES
// =====================================


function displayEmployees()
{
    const employeeList = document.getElementById("employeeList");

    if (!employeeList)
    {
        return;
    }

    employeeList.innerHTML = "";

    if (employees.length === 0)
    {
        employeeList.innerHTML =
            '<tr><td colspan="6">No employees found.</td></tr>';

        return;
    }

    employees.forEach(function(employee, index)
    {
        const row = employeeList.insertRow();

        row.insertCell().textContent = employee.id;
        row.insertCell().textContent = employee.name;
        row.insertCell().textContent = employee.department;
        row.insertCell().textContent = employee.designation || "-";
        row.insertCell().textContent = formatCurrency(employee.salary);

        const actionCell = row.insertCell();

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.onclick = function()
        {
            editEmployee(index);
        };

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function()
        {
            deleteEmployee(employee.id);
        };

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
    });
}



// =====================================
// EDIT EMPLOYEE
// =====================================


function editEmployee(index)
{
    const employee = employees[index];

    if (!employee)
    {
        return;
    }

    editingIndex = index;
    editingEmployeeId = employee.id;

    document.getElementById("empId").value = employee.id;
    document.getElementById("empId").readOnly = true;

    document.getElementById("empName").value = employee.name;
    document.getElementById("department").value = employee.department;
    document.getElementById("designation").value = employee.designation || "";
    document.getElementById("salary").value = employee.salary;

    const button = document.querySelector(
        '#employees button[onclick="addEmployee()"]'
    );

    if (button)
    {
        button.textContent = "Update Employee";
        button.onclick = saveEmployee;
    }

    showSection("employees");
}

// =====================================
// UPDATE EMPLOYEE
// =====================================


async function saveEmployee()
{
    if (editingEmployeeId === null)
    {
        return;
    }

    const name = document.getElementById("empName").value.trim();
    const department = document.getElementById("department").value.trim();
    const designation = document.getElementById("designation").value.trim();
    const salary = Number(document.getElementById("salary").value);

    if (!name || !department || !designation || !salary || salary <= 0)
    {
        alert("Please enter valid employee details.");
        return;
    }

    const updatedEmployee = {
        id: editingEmployeeId,
        name: name,
        department: department,
        designation: designation,
        salary: salary
    };

    try
    {
        const response = await fetch(
            `${EMPLOYEE_API}/${encodeURIComponent(editingEmployeeId)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedEmployee)
            }
        );

        await getResponseData(response);

        alert("Employee updated successfully!");

        clearEmployeeForm();

        await loadEmployees();

        updatePayroll();
        updateReports();
    }
    catch (error)
    {
        console.error("Update employee error:", error);

        alert("Unable to update employee.");
    }
}


// =====================================
// CLEAR EMPLOYEE FORM
// =====================================


function clearEmployeeForm()
{
    document.getElementById("empId").value = "";
    document.getElementById("empId").readOnly = false;

    document.getElementById("empName").value = "";
    document.getElementById("department").value = "";
    document.getElementById("designation").value = "";
    document.getElementById("salary").value = "";

    editingIndex = -1;
    editingEmployeeId = null;

    const button = document.querySelector(
        '#employees button[onclick="saveEmployee()"]'
    );

    if (button)
    {
        button.textContent = "Add Employee";
        button.onclick = addEmployee;
    }
}

// =====================================
// DELETE EMPLOYEE
// =====================================

async function deleteEmployee(id)
{
    const hasAttendance = attendanceRecords.some(
        record => record.id === id
    );

    if (hasAttendance)
    {
        alert(
            "This employee has attendance records. " +
            "Delete is not allowed while attendance records exist."
        );

        return;
    }

    if (!confirm("Are you sure you want to delete this employee?"))
    {
        return;
    }

    try
    {
        const response = await fetch(
            `${EMPLOYEE_API}/${encodeURIComponent(id)}`,
            {
                method: "DELETE"
            }
        );

        await getResponseData(response);

        alert("Employee deleted successfully!");

        await loadEmployees();

        updatePayroll();
        updateReports();
    }
    catch (error)
    {
        console.error("Delete employee error:", error);

        alert("Unable to delete employee.");
    }
}


// =====================================
// EMPLOYEE DROPDOWNS
// =====================================

function updateEmployeeDropdowns()
{
    const dropdown = document.getElementById("attendanceEmployee");
    const reportDropdown = document.getElementById("employeeReportSelect");

    if (dropdown)
    {
        const selectedValue = dropdown.value;

        dropdown.innerHTML =
            '<option value="">Select Employee ID</option>';

        employees.forEach(function(employee)
        {
            const option = document.createElement("option");

            option.value = employee.id;
            option.textContent = `${employee.id} - ${employee.name}`;

            dropdown.appendChild(option);
        });

        dropdown.value = selectedValue;
    }

    if (reportDropdown)
    {
        const selectedValue = reportDropdown.value;

        reportDropdown.innerHTML =
            '<option value="">Select Employee</option>';

        employees.forEach(function(employee)
        {
            const option = document.createElement("option");

            option.value = employee.id;
            option.textContent = `${employee.id} - ${employee.name}`;

            reportDropdown.appendChild(option);
        });

        reportDropdown.value = selectedValue;
    }
}


// =====================================
// LOAD ATTENDANCE
// =====================================

async function loadAttendance()
{
    try
    {
        const response = await fetch(ATTENDANCE_API);

        const records = await getResponseData(response) || [];

        attendanceRecords = records.map(function(record)
        {
            return {
                recordId: record.id,
                id: record.employeeId,
                name: record.employeeName,
                date: record.date,
                status: record.status
            };
        });

        displayAttendance();
        updateAttendanceDashboard();
    }
    catch (error)
    {
        console.error("Attendance loading error:", error);

        alert("Unable to load attendance records.");
    }
}


// =====================================
// CLEAR ATTENDANCE FORM
// =====================================

function clearAttendanceForm()
{
    document.getElementById("attendanceEmployee").value = "";
    document.getElementById("attendanceName").value = "";
    document.getElementById("attendanceDate").value = getTodayDate();
    document.getElementById("attendanceStatus").value = "Present";

    editingAttendanceId = null;

    const button = document.querySelector(
        '#attendance button[onclick="saveAttendance()"]'
    );

    if (button)
    {
        button.textContent = "Mark Attendance";
        button.onclick = markAttendance;
    }
}


// =====================================
// AUTO-FILL EMPLOYEE NAME
// =====================================

function updateEmployeeName()
{
    const employeeId =
        document.getElementById("attendanceEmployee").value;

    const employee = employees.find(
        item => item.id === employeeId
    );

    document.getElementById("attendanceName").value =
        employee ? employee.name : "";
}


// =====================================
// INDIVIDUAL ATTENDANCE
// =====================================

async function markAttendance()
{
    if (editingAttendanceId !== null)
    {
        await saveAttendance();
        return;
    }

    const employeeId =
        document.getElementById("attendanceEmployee").value;

    const date =
        document.getElementById("attendanceDate").value;

    const status =
        document.getElementById("attendanceStatus").value;

    const employee = employees.find(
        item => item.id === employeeId
    );

    if (!employee || !date || !status)
    {
        alert("Please fill all attendance details.");
        return;
    }

    const duplicate = attendanceRecords.find(
        record => record.id === employeeId && record.date === date
    );

    if (duplicate)
    {
        alert("Attendance already exists for this employee on this date.");
        return;
    }

    try
    {
        const response = await fetch(ATTENDANCE_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                employeeId: employee.id,
                employeeName: employee.name,
                date: date,
                status: status
            })
        });

        await getResponseData(response);

        alert("Attendance marked successfully!");

        clearAttendanceForm();

        await loadAttendance();

        loadBulkAttendance();
        updatePayroll();
        updateReports();
        updateDateReport();
    }
    catch (error)
    {
        console.error("Mark attendance error:", error);

        alert("Unable to mark attendance.");
    }
}


// =====================================
// DISPLAY ATTENDANCE
// =====================================

function displayAttendance()
{
    const attendanceList = document.getElementById("attendanceList");

    if (!attendanceList)
    {
        return;
    }

    attendanceList.innerHTML = "";

    if (attendanceRecords.length === 0)
    {
        attendanceList.innerHTML =
            '<tr><td colspan="5">No attendance records found.</td></tr>';

        return;
    }

    attendanceRecords.forEach(function(record)
    {
        const row = attendanceList.insertRow();

        row.insertCell().textContent = record.id;
        row.insertCell().textContent = record.name;
        row.insertCell().textContent = record.date;
        row.insertCell().textContent = record.status;

        const actionCell = row.insertCell();

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = function()
        {
            editAttendance(record.recordId);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function()
        {
            deleteAttendance(record.recordId);
        };

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
    });
}


// =====================================
// EDIT ATTENDANCE
// =====================================

function editAttendance(recordId)
{
    const record = attendanceRecords.find(
        item => item.recordId === recordId
    );

    if (!record)
    {
        return;
    }

    editingAttendanceId = recordId;

    document.getElementById("attendanceEmployee").value = record.id;
    document.getElementById("attendanceName").value = record.name;
    document.getElementById("attendanceDate").value = record.date;
    document.getElementById("attendanceStatus").value = record.status;

    const button = document.querySelector(
        '#attendance button[onclick="markAttendance()"]'
    );

    if (button)
    {
        button.textContent = "Update Attendance";
        button.onclick = saveAttendance;
    }

    showSection("attendance");
}


// =====================================
// UPDATE ATTENDANCE
// =====================================

async function saveAttendance()
{
    if (editingAttendanceId === null)
    {
        return;
    }

    const status =
        document.getElementById("attendanceStatus").value;

    try
    {
        const response = await fetch(
            `${ATTENDANCE_API}/${editingAttendanceId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: status
                })
            }
        );

        await getResponseData(response);

        alert("Attendance updated successfully!");

        clearAttendanceForm();

        await loadAttendance();

        loadBulkAttendance();
        updatePayroll();
        updateReports();
        updateDateReport();
    }
    catch (error)
    {
        console.error("Update attendance error:", error);

        alert("Unable to update attendance.");
    }
}


// =====================================
// DELETE ATTENDANCE
// =====================================

async function deleteAttendance(recordId)
{
    if (!confirm("Are you sure you want to delete this attendance record?"))
    {
        return;
    }

    try
    {
        const response = await fetch(
            `${ATTENDANCE_API}/${recordId}`,
            {
                method: "DELETE"
            }
        );

        await getResponseData(response);

        alert("Attendance deleted successfully!");

        await loadAttendance();

        loadBulkAttendance();
        updatePayroll();
        updateReports();
        updateDateReport();
    }
    catch (error)
    {
        console.error("Delete attendance error:", error);

        alert("Unable to delete attendance.");
    }
}


// =====================================
// BULK ATTENDANCE - LOAD EMPLOYEES
// =====================================

function loadBulkAttendance()
{
    const date =
        document.getElementById("bulkAttendanceDate").value;

    const list =
        document.getElementById("bulkAttendanceList");

    if (!date)
    {
        alert("Please select a date.");
        return;
    }

    list.innerHTML = "";

    if (employees.length === 0)
    {
        list.innerHTML =
            '<tr><td colspan="3">No employees found.</td></tr>';

        return;
    }

    employees.forEach(function(employee)
    {
        const existingRecord = attendanceRecords.find(
            record =>
                record.id === employee.id &&
                record.date === date
        );

        const selectedStatus = existingRecord
            ? existingRecord.status
            : "Present";

        const row = list.insertRow();

        row.insertCell().textContent = employee.id;
        row.insertCell().textContent = employee.name;

        const statusCell = row.insertCell();

        const select = document.createElement("select");

        select.className = "bulk-status";
        select.dataset.employeeId = employee.id;

        select.innerHTML = `
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
        `;

        select.value = selectedStatus;

        statusCell.appendChild(select);
    });
}


// =====================================
// BULK ATTENDANCE - SAVE ALL
// =====================================

async function saveAllAttendance()
{
    const date =
        document.getElementById("bulkAttendanceDate").value;

    const selects = document.querySelectorAll(
        "#bulkAttendanceList .bulk-status"
    );

    if (!date)
    {
        alert("Please select an attendance date.");
        return;
    }

    if (employees.length === 0 || selects.length === 0)
    {
        alert("Please load employees first.");
        return;
    }

    if (!confirm("Save attendance for all employees on this date?"))
    {
        return;
    }

    try
    {
        for (const select of selects)
        {
            const employeeId = select.dataset.employeeId;
            const status = select.value;

            const employee = employees.find(
                item => item.id === employeeId
            );

            if (!employee)
            {
                continue;
            }

            const existingRecord = attendanceRecords.find(
                record =>
                    record.id === employeeId &&
                    record.date === date
            );

            let response;

            if (existingRecord)
            {
                response = await fetch(
                    `${ATTENDANCE_API}/${existingRecord.recordId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            status: status
                        })
                    }
                );
            }
            else
            {
                response = await fetch(ATTENDANCE_API, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        employeeId: employee.id,
                        employeeName: employee.name,
                        date: date,
                        status: status
                    })
                });
            }

            await getResponseData(response);
        }

        await loadAttendance();

        loadBulkAttendance();
        updatePayroll();
        updateReports();
        updateDateReport();

        alert("Attendance saved successfully for all employees!");
    }
    catch (error)
    {
        console.error("Bulk attendance error:", error);

        await loadAttendance();

        loadBulkAttendance();
        updatePayroll();
        updateReports();
        updateDateReport();

        alert(
            "Some attendance records may not have been saved. " +
            "Please check the attendance list."
        );
    }
}


// =====================================
// DASHBOARD
// =====================================

function updateDashboard()
{
    const totalEmployees =
        document.getElementById("totalEmployees");

    if (totalEmployees)
    {
        totalEmployees.textContent = employees.length;
    }

    updateAttendanceDashboard();
    updateTotalPayroll();
}


function updateAttendanceDashboard()
{
    const today = getTodayDate();

    const todayRecords = attendanceRecords.filter(
        record => record.date === today
    );

    const present = todayRecords.filter(
        record => record.status === "Present"
    ).length;

    const absent = todayRecords.filter(
        record => record.status === "Absent"
    ).length;

    document.getElementById("presentToday").textContent = present;
    document.getElementById("absentToday").textContent = absent;
}


// =====================================
// TOTAL PAYROLL ON DASHBOARD
// =====================================

function updateTotalPayroll()
{
    const payrollElement =
        document.getElementById("totalPayroll");

    if (!payrollElement)
    {
        return;
    }

    const month = getTodayDate().slice(0, 7);

    let total = 0;

    employees.forEach(function(employee)
    {
        const result = calculateEmployeePayroll(employee, month);

        total += result.netSalary;
    });

    payrollElement.textContent = formatCurrency(total);
}


// =====================================
// CREATE PAYROLL AND REPORTS
// =====================================


function createPayrollAndReports()
{
    const payroll = document.getElementById("payroll");
    const reports = document.getElementById("reports");

    if (payroll)
    {
        payroll.innerHTML = `
            <div class="section-heading">
                <div>
                    <h2>Payroll Management</h2>
                    <p>Salary calculations and payslip management.</p>
                </div>
            </div>

            <label>Select Month:</label>
            <input type="month" id="payrollMonth">

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Present Days</th>
                            <th>Absent Days</th>
                            <th>Monthly Salary</th>
                            <th>Deduction</th>
                            <th>Net Salary</th>
                        </tr>
                    </thead>
                    <tbody id="payrollList"></tbody>
                </table>
            </div>

            <h3>Total Net Payroll:
                <span id="payrollTotal">₹0.00</span>
            </h3>
        `;
    }

    if (reports)
    {
        reports.innerHTML = `
            <div class="section-heading">
                <div>
                    <h2>Reports & Analytics</h2>
                    <p>Employee attendance and payroll reports.</p>
                </div>
            </div>

            <div class="report-section">
                <h3>Date-wise Attendance Report</h3>

                <label>Select Date:</label>
                <input type="date" id="reportDate">

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="dateReportList"></tbody>
                    </table>
                </div>
            </div>

            <div class="report-section">
                <h3>Employee-wise Attendance History</h3>

                <label>Select Employee:</label>

                <select id="employeeReportSelect">
                    <option value="">Select Employee</option>
                </select>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="employeeReportList"></tbody>
                    </table>
                </div>
            </div>

            <div class="report-section">
                <h3>Monthly Attendance Report</h3>

                <label>Select Month:</label>
                <input type="month" id="reportMonth">

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Present Days</th>
                                <th>Absent Days</th>
                                <th>Net Salary</th>
                            </tr>
                        </thead>
                        <tbody id="monthlyReportList"></tbody>
                    </table>
                </div>

                <h3>
                    Monthly Net Payroll:
                    <span id="monthlyReportTotal">₹0.00</span>
                </h3>
            </div>

            <!-- DATA VISUALIZATION GRAPHS -->

            <div class="report-section">
                <h3>Data Visualization</h3>

                <div class="report-charts">

                    <div class="chart-card">
                        <h3>Department-wise Employees</h3>
                        <img
                            src="../department_chart.svg"
                            alt="Department-wise Employee Chart">
                    </div>

                    <div class="chart-card">
                        <h3>Attendance Analysis</h3>
                        <img
                            src="../attendance_chart.svg"
                            alt="Present and Absent Attendance Chart">
                    </div>

                    <div class="chart-card">
                        <h3>Employee Salary Analysis</h3>
                        <img
                            src="../salary_chart.svg"
                            alt="Employee Salary Chart">
                    </div>

                </div>
            </div>
        `;
    }

    const today = getTodayDate();

    document.getElementById("payrollMonth").value = today.slice(0, 7);
    document.getElementById("reportDate").value = today;
    document.getElementById("reportMonth").value = today.slice(0, 7);

    document.getElementById("payrollMonth").addEventListener(
        "change",
        updatePayroll
    );

    document.getElementById("reportDate").addEventListener(
        "change",
        updateDateReport
    );

    document.getElementById("reportMonth").addEventListener(
        "change",
        updateReports
    );

    document.getElementById("employeeReportSelect").addEventListener(
        "change",
        updateEmployeeReport
    );

    updateEmployeeDropdowns();
}



// =====================================
// PAYROLL CALCULATION
// =====================================

function calculateEmployeePayroll(employee, month)
{
    const records = attendanceRecords.filter(
        record =>
            record.id === employee.id &&
            record.date.startsWith(month)
    );

    const presentDays = records.filter(
        record => record.status === "Present"
    ).length;

    const absentDays = records.filter(
        record => record.status === "Absent"
    ).length;

    const year = Number(month.slice(0, 4));
    const monthNumber = Number(month.slice(5, 7));

    const daysInMonth = new Date(
        year,
        monthNumber,
        0
    ).getDate();

    const monthlySalary = Number(employee.salary);
    const dailySalary = monthlySalary / daysInMonth;

    const deduction = dailySalary * absentDays;

    const netSalary = Math.max(
        0,
        monthlySalary - deduction
    );

    return {
        presentDays,
        absentDays,
        monthlySalary,
        deduction,
        netSalary
    };
}


// =====================================
// UPDATE PAYROLL TABLE
// =====================================

function updatePayroll()
{
    const payrollList = document.getElementById("payrollList");

    if (!payrollList)
    {
        return;
    }

    const month = document.getElementById("payrollMonth").value;

    payrollList.innerHTML = "";

    let totalPayroll = 0;

    if (employees.length === 0)
    {
        payrollList.innerHTML =
            '<tr><td colspan="7">No employees found.</td></tr>';
    }

    employees.forEach(function(employee)
    {
        const result = calculateEmployeePayroll(employee, month);

        totalPayroll += result.netSalary;

        const row = payrollList.insertRow();

        row.insertCell().textContent = employee.id;
        row.insertCell().textContent = employee.name;
        row.insertCell().textContent = result.presentDays;
        row.insertCell().textContent = result.absentDays;
        row.insertCell().textContent = formatCurrency(result.monthlySalary);
        row.insertCell().textContent = formatCurrency(result.deduction);
        row.insertCell().textContent = formatCurrency(result.netSalary);
    });

    document.getElementById("payrollTotal").textContent =
        formatCurrency(totalPayroll);

    updateTotalPayroll();
}


// =====================================
// DATE-WISE REPORT
// =====================================

function updateDateReport()
{
    const reportList = document.getElementById("dateReportList");

    if (!reportList)
    {
        return;
    }

    const selectedDate =
        document.getElementById("reportDate").value;

    reportList.innerHTML = "";

    const records = attendanceRecords.filter(
        record => record.date === selectedDate
    );

    if (records.length === 0)
    {
        reportList.innerHTML =
            '<tr><td colspan="4">No attendance records for this date.</td></tr>';

        return;
    }

    records.forEach(function(record)
    {
        const row = reportList.insertRow();

        row.insertCell().textContent = record.id;
        row.insertCell().textContent = record.name;
        row.insertCell().textContent = record.date;
        row.insertCell().textContent = record.status;
    });
}


// =====================================
// EMPLOYEE-WISE REPORT
// =====================================

function updateEmployeeReport()
{
    const reportList =
        document.getElementById("employeeReportList");

    if (!reportList)
    {
        return;
    }

    const employeeId =
        document.getElementById("employeeReportSelect").value;

    reportList.innerHTML = "";

    if (!employeeId)
    {
        reportList.innerHTML =
            '<tr><td colspan="4">Please select an employee.</td></tr>';

        return;
    }

    const records = attendanceRecords
        .filter(record => record.id === employeeId)
        .sort((a, b) => b.date.localeCompare(a.date));

    if (records.length === 0)
    {
        reportList.innerHTML =
            '<tr><td colspan="4">No attendance history found.</td></tr>';

        return;
    }

    records.forEach(function(record)
    {
        const row = reportList.insertRow();

        row.insertCell().textContent = record.id;
        row.insertCell().textContent = record.name;
        row.insertCell().textContent = record.date;
        row.insertCell().textContent = record.status;
    });
}


// =====================================
// MONTHLY REPORT
// =====================================

function updateReports()
{
    const reportList =
        document.getElementById("monthlyReportList");

    if (!reportList)
    {
        return;
    }

    const month =
        document.getElementById("reportMonth").value;

    reportList.innerHTML = "";

    let totalNetPayroll = 0;

    if (employees.length === 0)
    {
        reportList.innerHTML =
            '<tr><td colspan="5">No employees found.</td></tr>';
    }

    employees.forEach(function(employee)
    {
        const result = calculateEmployeePayroll(employee, month);

        totalNetPayroll += result.netSalary;

        const row = reportList.insertRow();

        row.insertCell().textContent = employee.id;
        row.insertCell().textContent = employee.name;
        row.insertCell().textContent = result.presentDays;
        row.insertCell().textContent = result.absentDays;
        row.insertCell().textContent = formatCurrency(result.netSalary);
    });

    document.getElementById("monthlyReportTotal").textContent =
        formatCurrency(totalNetPayroll);
}


// =====================================
// INITIALIZE APPLICATION
// =====================================

async function initializeApp()
{
    if (appInitialized)
    {
        return;
    }

    appInitialized = true;

    createPayrollAndReports();
    setupNavigation();

    document.getElementById("attendanceEmployee").addEventListener(
        "change",
        updateEmployeeName
    );

    document.getElementById("attendanceDate").value = getTodayDate();

    await loadEmployees();
    await loadAttendance();

    document.getElementById("bulkAttendanceDate").value = getTodayDate();

    loadBulkAttendance();

    displayEmployees();
    displayAttendance();

    updateEmployeeDropdowns();
    updateDashboard();
    updatePayroll();
    updateReports();
    updateDateReport();
    updateEmployeeReport();
}


// =====================================
// PAGE LOAD
// =====================================

document.addEventListener("DOMContentLoaded", function()
{
    console.log("Employee Attendance and Payroll System Ready");

    if (sessionStorage.getItem("payrollLoggedIn") === "true")
    {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("appLayout").style.display = "flex";

        initializeApp();
    }
    else
    {
        document.getElementById("loginPage").style.display = "flex";
        document.getElementById("appLayout").style.display = "none";
    }
});

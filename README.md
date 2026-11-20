Employee Attendance and Payroll Management System


## 1. Project Description

The Employee Attendance and Payroll Management System is a web-based application designed to manage employee information, attendance records, payroll calculations, and reports.

## 2. Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Java, Spring Boot
- Database: MySQL
- Data Processing: Python
- Development Tool: Visual Studio Code

## 3. Main Features

- Login and Logout
- Employee Management
- Add, View, Update and Delete Employees
- Individual and Bulk Attendance Management
- Present and Absent Tracking
- Payroll Calculation
- Date-wise Attendance Reports
- Employee-wise Attendance Reports
- Monthly Attendance Reports
- MySQL Database Integration
- Python Data Preprocessing
- Data Visualization

## 4. Project Modules

### Frontend
Provides the user interface for employee management, attendance, payroll and reports.

### Backend
Uses Java and Spring Boot to handle application logic and database operations.

### Database
MySQL stores employee details and attendance records.

### Python
Retrieves data from MySQL, preprocesses records and generates charts.

## 5. Database Setup

1. Install MySQL Server and MySQL Workbench.
2. Create a database named `employee_payroll`.
3. Configure the database username and password in the backend application properties.
4. Ensure the required tables are available.
5. Start the backend application.

## 6. How to Run the Project

### Backend

1. Open the `backend/employee-payroll` folder.
2. Open the terminal.
3. Run:

```bash
mvn spring-boot:run
```

### Frontend

1. Open the `frontend` folder.
2. Open `index.html` in a browser.
3. Use the login page to access the application.

### Python Scripts

Run the preprocessing script:

```bash
python data_preprocessing.py
```

Run the analysis script:

```bash
python data_analysis.py
```

## 7. Data Visualization

The Python scripts generate the following charts:

- Department-wise Employee Chart
- Attendance Status Chart
- Salary Analysis Chart

## 8. Testing

Functional testing, integration testing and database persistence testing are documented in the `testing` folder.

## 9. Conclusion

The system provides an integrated solution for managing employee details, attendance records, payroll calculations and reports. It reduces manual work and helps maintain employee information efficiently.

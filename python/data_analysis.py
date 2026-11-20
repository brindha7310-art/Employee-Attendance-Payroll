
import csv
from collections import Counter, defaultdict


# READ CSV FILE
def read_csv(filename):
    try:
        with open(filename, "r", encoding="utf-8") as file:
            return list(csv.DictReader(file))
    except FileNotFoundError:
        print(filename, "not found!")
        return []


# DEPARTMENT ANALYSIS
def department_analysis(employees):
    departments = Counter(
        employee["department"] for employee in employees
    )

    print("\nDEPARTMENT-WISE EMPLOYEE COUNT")

    for department, count in departments.items():
        print(department, ":", count)

    return departments


# ATTENDANCE ANALYSIS
def attendance_analysis(attendance):
    statuses = Counter(
        record["status"] for record in attendance
    )

    print("\nATTENDANCE ANALYSIS")

    for status, count in statuses.items():
        print(status, ":", count)

    return statuses


# EMPLOYEE-WISE ATTENDANCE
def employee_analysis(attendance):
    employee_counts = defaultdict(Counter)

    for record in attendance:
        employee_counts[record["employee_name"]][record["status"]] += 1

    print("\nEMPLOYEE-WISE ATTENDANCE")

    for employee, counts in employee_counts.items():
        print(
            employee,
            "- Present:", counts["Present"],
            "Absent:", counts["Absent"]
        )

    return employee_counts


# SALARY ANALYSIS
def salary_analysis(employees):
    salaries = [
        float(employee["salary"])
        for employee in employees
    ]

    if not salaries:
        return []

    average_salary = sum(salaries) / len(salaries)

    print("\nSALARY ANALYSIS")
    print("Total Salary:", sum(salaries))
    print("Average Salary:", round(average_salary, 2))
    print("Highest Salary:", max(salaries))
    print("Lowest Salary:", min(salaries))

    return salaries


# CREATE SVG BAR CHART
def create_bar_chart(filename, title, labels, values):
    width = 700
    height = 450
    chart_bottom = 350
    chart_top = 100
    chart_height = chart_bottom - chart_top

    maximum = max(values) if values else 1
    maximum = max(maximum, 1)

    bar_width = min(70, 400 // max(len(values), 1))
    gap = 400 // max(len(values), 1)

    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">',
        '<rect width="100%" height="100%" fill="white"/>',
        f'<text x="350" y="45" font-size="22" text-anchor="middle">{title}</text>',
        f'<line x1="80" y1="{chart_bottom}" x2="650" y2="{chart_bottom}" stroke="black"/>'
    ]

    for index, value in enumerate(values):
        bar_height = (value / maximum) * chart_height
        x = 100 + index * gap
        y = chart_bottom - bar_height

        svg.append(
            f'<rect x="{x}" y="{y}" width="{bar_width}" height="{bar_height}" fill="#4A90E2"/>'
        )

        svg.append(
            f'<text x="{x + bar_width / 2}" y="{y - 8}" font-size="14" text-anchor="middle">{value}</text>'
        )

        svg.append(
            f'<text x="{x + bar_width / 2}" y="{chart_bottom + 22}" font-size="12" text-anchor="middle">{labels[index]}</text>'
        )

    svg.append("</svg>")

    with open(filename, "w", encoding="utf-8") as file:
        file.write("\n".join(svg))

    print(filename, "created successfully!")


# MAIN FUNCTION
def main():
    employees = read_csv("cleaned_employees.csv")
    attendance = read_csv("cleaned_attendance.csv")

    if not employees or not attendance:
        print("Required CSV data is missing.")
        return

    departments = department_analysis(employees)
    statuses = attendance_analysis(attendance)
    employee_counts = employee_analysis(attendance)
    salaries = salary_analysis(employees)

    create_bar_chart(
        "department_chart.svg",
        "Employees by Department",
        list(departments.keys()),
        list(departments.values())
    )

    create_bar_chart(
        "attendance_chart.svg",
        "Present vs Absent",
        list(statuses.keys()),
        list(statuses.values())
    )

    create_bar_chart(
        "salary_chart.svg",
        "Employee Salary Analysis",
        [employee["name"] for employee in employees],
        salaries
    )

    print("\nData analysis completed successfully!")
    print("All charts generated successfully.")


if __name__ == "__main__":
    main()

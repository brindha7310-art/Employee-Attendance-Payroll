# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## 1. Introduction

### 1.1 Project Title
Employee Attendance and Payroll Management System

### 1.2 Purpose
The purpose of this project is to develop a web-based system to manage employee details, attendance records, payroll calculations, and reports efficiently.

### 1.3 Scope
The system helps the administrator manage employee information, record daily attendance, calculate payroll, and generate attendance reports. It uses a web frontend, Java Spring Boot backend, and MySQL database.

## 2. Overall Description

### 2.1 Product Perspective
This is a web-based application developed using HTML, CSS, JavaScript, Java Spring Boot, MySQL, and Python.

### 2.2 User
The administrator uses the application to manage employee information, attendance, payroll, and reports.

### 2.3 Operating Environment
- Operating System: Windows
- Frontend: HTML, CSS, JavaScript
- Backend: Java Spring Boot
- Database: MySQL
- Data Processing: Python
- IDE: Visual Studio Code

## 3. Functional Requirements

1. **Login:** The system provides a demo login screen to access the application.
2. **Dashboard:** Displays employee and attendance summary information.
3. **Employee Management:** Allows adding, viewing, updating, and deleting employee details.
4. **Attendance Management:** Allows recording Present or Absent status for employees.
5. **Bulk Attendance:** Allows marking attendance for multiple employees.
6. **Payroll Calculation:** Calculates payroll based on employee salary and attendance information.
7. **Attendance Reports:** Generates date-wise attendance reports.
8. **Employee Reports:** Displays employee-wise attendance details.
9. **Monthly Reports:** Displays monthly attendance summaries.
10. **Logout:** Allows the user to exit the application.

## 4. Non-Functional Requirements

### 4.1 Performance
The system should respond to user actions within a reasonable time.

### 4.2 Reliability
Employee and attendance information should be stored in the MySQL database.

### 4.3 Usability
The application should provide a simple and user-friendly interface.

### 4.4 Maintainability
The frontend, backend, database, and Python modules are maintained separately.

### 4.5 Data Integrity
The system should maintain correct employee and attendance records.

## 5. Hardware Requirements

- Processor: Intel Core i3 or above
- RAM: 4 GB or above
- Hard Disk: 500 MB free space
- Monitor and keyboard

## 6. Software Requirements

- Windows Operating System
- Visual Studio Code
- Java Development Kit (JDK 21)
- Spring Boot
- MySQL Server
- MySQL Workbench
- Python 3
- Web Browser

## 7. External Interface Requirements

### 7.1 User Interface
The application provides login, dashboard, employee management, attendance management, payroll, and report sections.

### 7.2 Database Interface
The Java backend communicates with the MySQL database to store and retrieve employee and attendance information.

### 7.3 Python Interface
Python connects to the MySQL database to retrieve, preprocess, and analyze project data. It generates charts for data visualization.

## 8. System Constraints

- MySQL Server must be running.
- Java backend must be started before using database-related frontend operations.
- Python requires the database connection details to retrieve project data.
- The application requires a supported web browser.

## 9. Assumptions

- The administrator enters valid employee information.
- Employee salary details are maintained in the database.
- Attendance records are entered correctly.
- The database is available when the application is running.

## 10. Conclusion

The Employee Attendance and Payroll Management System simplifies employee record management, attendance tracking, payroll calculation, and report generation. It combines web technologies, Java, MySQL, and Python to provide an integrated management solution.

# Relational Model – Employee Attendance and Payroll Management System

## 1. Introduction

The relational model describes how employee information and attendance records are stored and related in the MySQL database.

The system contains two main tables:
- EMPLOYEES
- ATTENDANCE_RECORDS

## 2. EMPLOYEES Table

This table stores employee details.

| Attribute | Data Type | Constraint | Description |
|---|---|---|---|
| employee_id | VARCHAR | Primary Key | Unique employee ID |
| name | VARCHAR | NOT NULL | Employee name |
| department | VARCHAR | NOT NULL | Employee department |
| salary | DOUBLE | NOT NULL | Employee salary |

**Primary Key:** employee_id

## 3. ATTENDANCE_RECORDS Table

This table stores employee attendance information.

| Attribute | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGINT | Primary Key, Auto Increment | Unique attendance record ID |
| employee_id | VARCHAR | Foreign Key | Employee ID |
| employee_name | VARCHAR | - | Employee name |
| attendance_date | DATE | - | Attendance date |
| status | VARCHAR | - | Present or Absent |

**Primary Key:** id

**Foreign Key:** employee_id references EMPLOYEES(employee_id).

## 4. Relationship Between Tables

- One employee can have multiple attendance records.
- Each attendance record belongs to one employee.
- The relationship between EMPLOYEES and ATTENDANCE_RECORDS is One-to-Many (1:N).

## 5. Relational Schema

**EMPLOYEES**

EMPLOYEES(employee_id, name, department, salary)

**ATTENDANCE_RECORDS**

ATTENDANCE_RECORDS(id, employee_id, employee_name, attendance_date, status)

## 6. Database Constraints

- Primary keys uniquely identify each record.
- Foreign keys establish the relationship between tables.
- Employee IDs are used to connect employee details with attendance records.
- Attendance status stores Present or Absent.

## 7. Conclusion

The relational model organizes employee and attendance information into related tables. It supports efficient storage, retrieval and management of employee attendance data.


# Database Normalization – Employee Attendance and Payroll Management System

## 1. Introduction

Normalization is the process of organizing database tables to reduce data redundancy and improve data consistency.

The database is analyzed using the following normal forms:

- First Normal Form (1NF)
- Second Normal Form (2NF)
- Third Normal Form (3NF)

## 2. First Normal Form (1NF)

A table is in 1NF when:
- Each column contains atomic values.
- Each record is unique.
- There are no repeating groups.

In this project:
- Employee details are stored separately.
- Each attendance record contains one attendance date and one status.
- Each table has a primary key.

Therefore, the tables satisfy 1NF.

## 3. Second Normal Form (2NF)

A table is in 2NF when:
- It satisfies 1NF.
- Every non-key attribute depends on the entire primary key.
- There are no partial dependencies.

In this project:
- EMPLOYEES has employee_id as its primary key.
- ATTENDANCE_RECORDS has id as its primary key.
- Both tables use single-column primary keys.

Therefore, the tables satisfy 2NF.

## 4. Third Normal Form (3NF)

A table is in 3NF when:
- It satisfies 2NF.
- There are no transitive dependencies of non-key attributes on the primary key.

In the current ATTENDANCE_RECORDS table, employee_name is stored along with employee_id.

Since employee_name can be obtained from the EMPLOYEES table using employee_id, storing it again creates redundant data.

For a fully normalized 3NF design, employee_name can be removed from ATTENDANCE_RECORDS and retrieved using a JOIN with EMPLOYEES.

The current application retains employee_name in the attendance table for its existing implementation.

## 5. Benefits of Normalization

- Reduces unnecessary data duplication.
- Improves data consistency.
- Organizes database tables.
- Makes database maintenance easier.
- Helps maintain relationships between tables.

## 6. Conclusion

Normalization helps organize the Employee Attendance and Payroll Management System database efficiently. The current design satisfies 1NF and 2NF. The employee_name field in the attendance table is a redundancy that can be addressed in a fully normalized 3NF design.


-- Employee Attendance and Payroll Management System
-- Database Schema

CREATE DATABASE IF NOT EXISTS employee_payroll;

USE employee_payroll;

-- Employee Table
CREATE TABLE IF NOT EXISTS employees
(
    employee_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    salary DOUBLE NOT NULL
);

-- Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(255),
    employee_name VARCHAR(255),
    attendance_date DATE,
    status VARCHAR(255),

    FOREIGN KEY (employee_id)
    REFERENCES employees(employee_id)
);

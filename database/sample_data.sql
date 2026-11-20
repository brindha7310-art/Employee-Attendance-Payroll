
-- Sample Data for Employee Attendance and Payroll Management System

USE employee_payroll;

-- Sample Employee Records
INSERT INTO employees (employee_id, name, department, salary)
VALUES
('EMP001', 'Aruna', 'IT', 40000),
('EMP002', 'Varun', 'CSE', 45000),
('EMP003', 'Sharan', 'EEE', 32000),
('EMP004', 'Ravi', 'AIDS', 50000),
('EMP005', 'Kumar', 'MECH', 21000);

-- Sample Attendance Records
INSERT INTO attendance_records
(employee_id, employee_name, attendance_date, status)
VALUES
('EMP001', 'Aruna', '2026-11-10', 'Present'),
('EMP001', 'Aruna', '2026-11-11', 'Present'),
('EMP002', 'Varun', '2026-11-10', 'Present'),
('EMP002', 'Varun', '2026-11-11', 'Absent'),
('EMP003', 'Sharan', '2026-11-10', 'Absent'),
('EMP003', 'Sharan', '2026-11-11', 'Absent'),
('EMP004', 'Ravi', '2026-11-10', 'Present'),
('EMP004', 'Ravi', '2026-11-11', 'Present');

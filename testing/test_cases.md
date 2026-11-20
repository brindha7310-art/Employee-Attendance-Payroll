# Test Cases – Employee Attendance and Payroll Management System

## 1. Introduction
This document describes the test cases used to verify the functionality of the Employee Attendance and Payroll Management System.

## 2. Test Cases

| Test Case ID | Module | Test Scenario | Expected Result |
|---|---|---|---|
| TC01 | Login | Enter valid login details | Dashboard should open |
| TC02 | Login | Enter invalid login details | Error message should be displayed |
| TC03 | Dashboard | Open dashboard | Dashboard statistics should be displayed |
| TC04 | Employee | Add a new employee | Employee should be saved successfully |
| TC05 | Employee | View employee details | Employee details should be displayed |
| TC06 | Employee | Update employee details | Updated details should be saved |
| TC07 | Employee | Delete an employee | Employee should be removed |
| TC08 | Attendance | Mark an employee as Present | Attendance should be saved |
| TC09 | Attendance | Mark an employee as Absent | Attendance should be saved |
| TC10 | Attendance | Update existing attendance | Existing record should be updated without duplication |
| TC11 | Payroll | Calculate employee salary | Payroll amount should be calculated |
| TC12 | Reports | Generate attendance report | Attendance report should be displayed |
| TC13 | Reports | Generate employee-wise report | Employee attendance details should be displayed |
| TC14 | Database | Refresh the application | Saved data should remain available |
| TC15 | Logout | Click logout | User should return to login page |

## 3. Testing Approach
The system is tested using functional testing, integration testing and database persistence testing.
package com.example.payroll;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long>
{
    boolean existsByEmployeeId(String employeeId);
}
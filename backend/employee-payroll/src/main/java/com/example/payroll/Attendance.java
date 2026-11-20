
package com.example.payroll;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance_records")
public class Attendance
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id")
    private String employeeId;

    private String employeeName;

    @Column(name = "attendance_date")
    private LocalDate date;

    private String status;

    public Attendance()
    {
    }

    public Long getId()
    {
        return id;
    }

    public String getEmployeeId()
    {
        return employeeId;
    }

    public void setEmployeeId(String employeeId)
    {
        this.employeeId = employeeId;
    }

    public String getEmployeeName()
    {
        return employeeName;
    }

    public void setEmployeeName(String employeeName)
    {
        this.employeeName = employeeName;
    }

    public LocalDate getDate()
    {
        return date;
    }

    public void setDate(LocalDate date)
    {
        this.date = date;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }
}

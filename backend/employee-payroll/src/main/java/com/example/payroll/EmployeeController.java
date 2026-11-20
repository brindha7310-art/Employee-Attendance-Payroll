
package com.example.payroll;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController
{
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final PythonChartService pythonChartService;

    public EmployeeController(
        EmployeeRepository employeeRepository,
        AttendanceRepository attendanceRepository,
        PythonChartService pythonChartService)
    {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.pythonChartService = pythonChartService;
    }

    // ADD EMPLOYEE
    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee)
    {
        if (employeeRepository.existsById(employee.getId()))
        {
            throw new RuntimeException("Employee ID already exists!");
        }

        Employee savedEmployee = employeeRepository.save(employee);
        pythonChartService.refreshCharts();

        return savedEmployee;
    }

    // GET ALL EMPLOYEES
    @GetMapping
    public List<Employee> getAllEmployees()
    {
        return employeeRepository.findAll();
    }

    // GET EMPLOYEE BY ID
    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable String id)
    {
        return employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    // UPDATE EMPLOYEE
    @PutMapping("/{id}")
    public Employee updateEmployee(
        @PathVariable String id,
        @RequestBody Employee updatedEmployee)
    {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setName(updatedEmployee.getName());
        employee.setDepartment(updatedEmployee.getDepartment());
        employee.setSalary(updatedEmployee.getSalary());

        Employee savedEmployee = employeeRepository.save(employee);
        pythonChartService.refreshCharts();

        return savedEmployee;
    }

    // DELETE EMPLOYEE
    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable String id)
    {
        if (!employeeRepository.existsById(id))
        {
            throw new RuntimeException("Employee not found");
        }

        if (attendanceRepository.existsByEmployeeId(id))
        {
            throw new RuntimeException(
                "Cannot delete employee because attendance records exist."
            );
        }

        employeeRepository.deleteById(id);
        pythonChartService.refreshCharts();

        return "Employee deleted successfully!";
    }
}

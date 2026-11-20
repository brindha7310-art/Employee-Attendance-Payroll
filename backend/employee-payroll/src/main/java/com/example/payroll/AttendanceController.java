
package com.example.payroll;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController
{
    private final AttendanceRepository attendanceRepository;
    private final PythonChartService pythonChartService;

    public AttendanceController(
        AttendanceRepository attendanceRepository,
        PythonChartService pythonChartService)
    {
        this.attendanceRepository = attendanceRepository;
        this.pythonChartService = pythonChartService;
    }

    // ADD ATTENDANCE
    @PostMapping
    public Attendance addAttendance(@RequestBody Attendance attendance)
    {
        boolean alreadyMarked = attendanceRepository.findAll()
            .stream()
            .anyMatch(record ->
                record.getEmployeeId().equals(attendance.getEmployeeId())
                && record.getDate().equals(attendance.getDate())
            );

        if (alreadyMarked)
        {
            throw new RuntimeException("Attendance already marked!");
        }

        Attendance savedAttendance = attendanceRepository.save(attendance);
        pythonChartService.refreshCharts();

        return savedAttendance;
    }

    // GET ALL ATTENDANCE
    @GetMapping
    public List<Attendance> getAllAttendance()
    {
        return attendanceRepository.findAll();
    }

    // UPDATE ATTENDANCE
    @PutMapping("/{id}")
    public Attendance updateAttendance(
        @PathVariable Long id,
        @RequestBody Attendance updatedAttendance)
    {
        Attendance attendance = attendanceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Attendance not found"));

        attendance.setStatus(updatedAttendance.getStatus());

        Attendance savedAttendance = attendanceRepository.save(attendance);
        pythonChartService.refreshCharts();

        return savedAttendance;
    }

    // DELETE ATTENDANCE
    @DeleteMapping("/{id}")
    public String deleteAttendance(@PathVariable Long id)
    {
        attendanceRepository.deleteById(id);
        pythonChartService.refreshCharts();

        return "Attendance deleted successfully!";
    }
}

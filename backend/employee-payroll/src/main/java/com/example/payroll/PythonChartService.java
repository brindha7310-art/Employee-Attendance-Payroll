
package com.example.payroll;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.FileTime;

@Service
public class PythonChartService
{
    private final Path projectDirectory = Path.of(
        "C:\\Users\\TKBH\\Desktop\\Employee_Attendance_Payroll"
    );

    public synchronized void refreshCharts()
    {
        try
        {
            System.out.println("========== GRAPH REFRESH STARTED ==========");

            if (!Files.isDirectory(projectDirectory))
            {
                throw new RuntimeException("Project folder not found: " + projectDirectory);
            }

            runPythonScript("python/data_preprocessing.py");

            Path employeeCsv = projectDirectory.resolve("cleaned_employees.csv");
            Path attendanceCsv = projectDirectory.resolve("cleaned_attendance.csv");

            if (!Files.exists(employeeCsv) || !Files.exists(attendanceCsv))
            {
                throw new RuntimeException("Updated CSV files were not created.");
            }

            runPythonScript("python/data_analysis.py");

            checkChart("department_chart.svg");
            checkChart("attendance_chart.svg");
            checkChart("salary_chart.svg");

            System.out.println("All graphs refreshed successfully!");
            System.out.println("========== GRAPH REFRESH COMPLETED ==========");
        }
        catch (Exception error)
        {
            System.err.println("GRAPH REFRESH FAILED: " + error.getMessage());
            error.printStackTrace();
        }
    }

    private void runPythonScript(String script) throws Exception
    {
        Path scriptPath = projectDirectory.resolve(script);

        if (!Files.exists(scriptPath))
        {
            throw new RuntimeException("Python file not found: " + scriptPath);
        }

        ProcessBuilder builder = new ProcessBuilder(
            "py", "-3", script
        );

        builder.directory(projectDirectory.toFile());
        builder.redirectErrorStream(true);

        Process process = builder.start();

        try (BufferedReader reader = new BufferedReader(
            new InputStreamReader(
                process.getInputStream(),
                StandardCharsets.UTF_8
            )))
        {
            String line;

            while ((line = reader.readLine()) != null)
            {
                System.out.println("[Python] " + line);
            }
        }

        int exitCode = process.waitFor();

        if (exitCode != 0)
        {
            throw new RuntimeException(
                script + " failed. Exit code: " + exitCode
            );
        }
    }

    private void checkChart(String filename) throws Exception
    {
        Path chart = projectDirectory.resolve(filename);

        if (!Files.exists(chart) || Files.size(chart) == 0)
        {
            throw new RuntimeException(filename + " was not generated.");
        }

        FileTime modified = Files.getLastModifiedTime(chart);

        System.out.println(
            filename + " verified. Last updated: " + modified
        );
    }
}

package com.projectflow.controller;

import com.projectflow.dto.ApiResponse;
import com.projectflow.dto.ReportsDto;
import com.projectflow.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ReportsDto>> getFullReports() {
        ReportsDto reports = reportService.getFullReports();
        return ResponseEntity.ok(ApiResponse.success("Reports generated successfully", reports));
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<Object>> getProjectReports() {
        ReportsDto reports = reportService.getFullReports();
        return ResponseEntity.ok(ApiResponse.success("Project completion report retrieved", reports.getProjectCompletionStats()));
    }

    @GetMapping("/tasks")
    public ResponseEntity<ApiResponse<Object>> getTaskReports() {
        ReportsDto reports = reportService.getFullReports();
        return ResponseEntity.ok(ApiResponse.success("Task completion report retrieved", reports.getTaskStatusBreakdown()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Object>> getUserReports() {
        ReportsDto reports = reportService.getFullReports();
        return ResponseEntity.ok(ApiResponse.success("Team performance report retrieved", reports.getTeamPerformanceStats()));
    }
}

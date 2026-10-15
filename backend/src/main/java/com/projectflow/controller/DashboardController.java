package com.projectflow.controller;

import com.projectflow.dto.*;
import com.projectflow.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardAdminDto>> getAdminDashboard() {
        DashboardAdminDto dto = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard metrics retrieved", dto));
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<DashboardManagerDto>> getManagerDashboard(Authentication authentication) {
        DashboardManagerDto dto = dashboardService.getManagerDashboard(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Project Manager dashboard metrics retrieved", dto));
    }

    @GetMapping("/member")
    public ResponseEntity<ApiResponse<DashboardMemberDto>> getMemberDashboard(Authentication authentication) {
        DashboardMemberDto dto = dashboardService.getMemberDashboard(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Team Member dashboard metrics retrieved", dto));
    }
}

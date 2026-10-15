package com.projectflow.controller;

import com.projectflow.dto.ApiResponse;
import com.projectflow.dto.SystemSettingDto;
import com.projectflow.service.SystemSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@PreAuthorize("hasRole('ADMIN')")
public class SystemSettingController {

    private final SystemSettingService settingService;

    public SystemSettingController(SystemSettingService settingService) {
        this.settingService = settingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SystemSettingDto>>> getAllSettings() {
        List<SystemSettingDto> settings = settingService.getAllSettings();
        return ResponseEntity.ok(ApiResponse.success("System settings retrieved", settings));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<List<SystemSettingDto>>> updateSettings(@RequestBody Map<String, String> settingsMap) {
        List<SystemSettingDto> updated = settingService.updateSettings(settingsMap);
        return ResponseEntity.ok(ApiResponse.success("System settings updated successfully", updated));
    }
}

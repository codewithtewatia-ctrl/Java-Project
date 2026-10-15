package com.projectflow.controller;

import com.projectflow.dto.*;
import com.projectflow.entity.User;
import com.projectflow.repository.UserRepository;
import com.projectflow.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    public ProjectController(ProjectService projectService, UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getProjects(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        List<ProjectDto> projects = projectService.getProjectsForUser(user);
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved successfully", projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectById(@PathVariable Long id) {
        ProjectDto project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success("Project retrieved successfully", project));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(@Valid @RequestBody ProjectRequest request) {
        ProjectDto created = projectService.createProject(request);
        return ResponseEntity.ok(ApiResponse.success("Project created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(@PathVariable Long id, @RequestBody ProjectRequest request) {
        ProjectDto updated = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully"));
    }
}

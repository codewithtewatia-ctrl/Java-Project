package com.projectflow.controller;

import com.projectflow.dto.*;
import com.projectflow.entity.User;
import com.projectflow.repository.UserRepository;
import com.projectflow.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskDto>>> getAllTasks() {
        List<TaskDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved successfully", tasks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDto>> getTaskById(@PathVariable Long id) {
        TaskDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success("Task retrieved successfully", task));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTasksByProject(@PathVariable Long projectId) {
        List<TaskDto> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(ApiResponse.success("Tasks for project retrieved", tasks));
    }

    @GetMapping("/assigned")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getAssignedTasks(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        List<TaskDto> tasks = taskService.getAssignedTasks(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Assigned tasks retrieved", tasks));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<TaskDto>> createTask(@Valid @RequestBody TaskRequest request) {
        TaskDto created = taskService.createTask(request);
        return ResponseEntity.ok(ApiResponse.success("Task created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        TaskDto updated = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<TaskDto>> assignTask(@PathVariable Long id, @Valid @RequestBody TaskAssignRequest request) {
        TaskDto updated = taskService.assignTask(id, request.getAssigneeId());
        return ResponseEntity.ok(ApiResponse.success("Task assigned successfully.", updated));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskDto>> updateTaskStatus(@PathVariable Long id, @Valid @RequestBody TaskStatusUpdateRequest request) {
        TaskDto updated = taskService.updateTaskStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Task status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully"));
    }
}

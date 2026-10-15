package com.projectflow.service;

import com.projectflow.dto.ProjectDto;
import com.projectflow.dto.ProjectRequest;
import com.projectflow.entity.*;
import com.projectflow.exception.ResourceNotFoundException;
import com.projectflow.repository.ProjectRepository;
import com.projectflow.repository.TaskRepository;
import com.projectflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository,
                          TaskRepository taskRepository,
                          NotificationService notificationService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::enrichProjectDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return enrichProjectDto(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getProjectsForUser(User user) {
        if (user.getRole() == Role.ADMIN) {
            return getAllProjects();
        } else if (user.getRole() == Role.PROJECT_MANAGER) {
            return projectRepository.findByProjectManagerId(user.getId()).stream()
                    .map(this::enrichProjectDto)
                    .collect(Collectors.toList());
        } else {
            return projectRepository.findByTeamMemberOrManagerId(user.getId()).stream()
                    .map(this::enrichProjectDto)
                    .collect(Collectors.toList());
        }
    }

    @Transactional
    public ProjectDto createProject(ProjectRequest request) {
        User manager = null;
        if (request.getProjectManagerId() != null) {
            manager = userRepository.findById(request.getProjectManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User (Manager)", "id", request.getProjectManagerId()));
        }

        Project project = new Project(
                request.getTitle(),
                request.getDescription(),
                request.getStartDate(),
                request.getEndDate(),
                request.getStatus() != null ? request.getStatus() : ProjectStatus.PLANNING,
                manager
        );

        if (request.getTeamMemberIds() != null && !request.getTeamMemberIds().isEmpty()) {
            Set<User> teamMembers = new HashSet<>(userRepository.findAllById(request.getTeamMemberIds()));
            project.setTeamMembers(teamMembers);
        }

        Project saved = projectRepository.save(project);

        if (manager != null) {
            notificationService.createNotification(manager, "Assigned to Project", 
                    "You have been assigned as Manager for project: " + saved.getTitle(), "PROJECT");
        }

        return enrichProjectDto(saved);
    }

    @Transactional
    public ProjectDto updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        if (request.getTitle() != null) {
            project.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getStartDate() != null) {
            project.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            project.setEndDate(request.getEndDate());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }

        if (request.getProjectManagerId() != null) {
            User manager = userRepository.findById(request.getProjectManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User (Manager)", "id", request.getProjectManagerId()));
            project.setProjectManager(manager);
        }

        if (request.getTeamMemberIds() != null) {
            Set<User> teamMembers = new HashSet<>(userRepository.findAllById(request.getTeamMemberIds()));
            project.setTeamMembers(teamMembers);
        }

        Project updated = projectRepository.save(project);
        updateProjectProgress(updated.getId());

        return enrichProjectDto(updated);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        List<Task> tasks = taskRepository.findByProjectId(id);
        taskRepository.deleteAll(tasks);

        projectRepository.delete(project);
    }

    @Transactional
    public void updateProjectProgress(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return;

        long total = taskRepository.countByProjectId(projectId);
        long completed = taskRepository.countByProjectIdAndStatus(projectId, TaskStatus.COMPLETED);

        int progressPercent = (total > 0) ? (int) ((completed * 100) / total) : 0;
        project.setProgress(progressPercent);

        if (progressPercent == 100 && total > 0 && project.getStatus() != ProjectStatus.COMPLETED) {
            project.setStatus(ProjectStatus.COMPLETED);
        }

        projectRepository.save(project);
    }

    private ProjectDto enrichProjectDto(Project project) {
        ProjectDto dto = new ProjectDto(project);
        long total = taskRepository.countByProjectId(project.getId());
        long completed = taskRepository.countByProjectIdAndStatus(project.getId(), TaskStatus.COMPLETED);
        dto.setTotalTasks(total);
        dto.setCompletedTasks(completed);
        dto.setPendingTasks(total - completed);
        return dto;
    }
}

package com.projectflow.service;

import com.projectflow.dto.TaskDto;
import com.projectflow.dto.TaskRequest;
import com.projectflow.entity.*;
import com.projectflow.exception.ResourceNotFoundException;
import com.projectflow.repository.ProjectRepository;
import com.projectflow.repository.TaskRepository;
import com.projectflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;
    private final NotificationService notificationService;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       UserRepository userRepository,
                       ProjectService projectService,
                       NotificationService notificationService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectService = projectService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(TaskDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return new TaskDto(task);
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(TaskDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getAssignedTasks(Long assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId).stream()
                .map(TaskDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDto createTask(TaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User (Assignee)", "id", request.getAssigneeId()));
        }

        Task task = new Task(
                request.getTitle(),
                request.getDescription(),
                project,
                assignee,
                request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM,
                request.getStatus() != null ? request.getStatus() : TaskStatus.TODO,
                request.getStartDate(),
                request.getDueDate()
        );

        Task saved = taskRepository.save(task);

        // Auto-add assignee to project team members if not already present
        if (assignee != null && !project.getTeamMembers().contains(assignee)) {
            project.getTeamMembers().add(assignee);
            projectRepository.save(project);
        }

        projectService.updateProjectProgress(project.getId());

        if (assignee != null) {
            notificationService.createNotification(assignee, "New Task Assigned",
                    "You have been assigned to task: " + saved.getTitle() + " in project " + project.getTitle(), "TASK");
        }

        return new TaskDto(saved);
    }

    @Transactional
    public TaskDto updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getStartDate() != null) task.setStartDate(request.getStartDate());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User (Assignee)", "id", request.getAssigneeId()));
            task.setAssignee(assignee);
        }

        Task updated = taskRepository.save(task);
        projectService.updateProjectProgress(task.getProject().getId());

        return new TaskDto(updated);
    }

    @Transactional
    public TaskDto assignTask(Long id, Long assigneeId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User (Assignee)", "id", assigneeId));

        task.setAssignee(assignee);
        Task updated = taskRepository.save(task);

        Project project = task.getProject();
        if (!project.getTeamMembers().contains(assignee)) {
            project.getTeamMembers().add(assignee);
            projectRepository.save(project);
        }

        notificationService.createNotification(assignee, "Task Assigned",
                "You have been assigned to task: " + task.getTitle(), "TASK");

        return new TaskDto(updated);
    }

    @Transactional
    public TaskDto updateTaskStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        task.setStatus(status);
        Task updated = taskRepository.save(task);

        projectService.updateProjectProgress(task.getProject().getId());

        if (task.getProject().getProjectManager() != null) {
            notificationService.createNotification(task.getProject().getProjectManager(),
                    "Task Status Updated",
                    "Task '" + task.getTitle() + "' status changed to " + status, "TASK");
        }

        return new TaskDto(updated);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        Long projectId = task.getProject().getId();
        taskRepository.delete(task);
        projectService.updateProjectProgress(projectId);
    }
}

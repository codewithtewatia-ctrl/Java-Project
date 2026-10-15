package com.projectflow.service;

import com.projectflow.dto.*;
import com.projectflow.entity.*;
import com.projectflow.exception.ResourceNotFoundException;
import com.projectflow.repository.ProjectRepository;
import com.projectflow.repository.TaskRepository;
import com.projectflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public DashboardService(UserRepository userRepository,
                            ProjectRepository projectRepository,
                            TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public DashboardAdminDto getAdminDashboard() {
        DashboardAdminDto dto = new DashboardAdminDto();

        dto.setTotalUsers(userRepository.count());
        dto.setActiveUsers(userRepository.countByStatus(UserStatus.ACTIVE));

        dto.setTotalProjects(projectRepository.count());
        dto.setActiveProjects(projectRepository.countByStatus(ProjectStatus.ACTIVE));
        dto.setCompletedProjects(projectRepository.countByStatus(ProjectStatus.COMPLETED));

        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByStatus(TaskStatus.COMPLETED);
        dto.setTotalTasks(totalTasks);
        dto.setCompletedTasks(completedTasks);
        dto.setPendingTasks(totalTasks - completedTasks);

        // Distributions
        Map<String, Long> userRoles = new HashMap<>();
        for (Role role : Role.values()) {
            userRoles.put(role.name(), userRepository.countByRole(role));
        }
        dto.setUserRoleDistribution(userRoles);

        Map<String, Long> projectStatuses = new HashMap<>();
        for (ProjectStatus status : ProjectStatus.values()) {
            projectStatuses.put(status.name(), projectRepository.countByStatus(status));
        }
        dto.setProjectStatusDistribution(projectStatuses);

        Map<String, Long> taskStatuses = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            taskStatuses.put(status.name(), taskRepository.countByStatus(status));
        }
        dto.setTaskStatusDistribution(taskStatuses);

        Map<String, Long> taskPriorities = new HashMap<>();
        for (TaskPriority priority : TaskPriority.values()) {
            taskPriorities.put(priority.name(), taskRepository.countByPriority(priority));
        }
        dto.setTaskPriorityDistribution(taskPriorities);

        return dto;
    }

    @Transactional(readOnly = true)
    public DashboardManagerDto getManagerDashboard(String userEmail) {
        User manager = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        DashboardManagerDto dto = new DashboardManagerDto();

        List<Project> managedProjects = projectRepository.findByProjectManagerId(manager.getId());
        dto.setTotalManagedProjects(managedProjects.size());

        long activeCount = managedProjects.stream()
                .filter(p -> p.getStatus() == ProjectStatus.ACTIVE)
                .count();
        dto.setActiveProjects(activeCount);

        List<Task> allManagedTasks = new ArrayList<>();
        for (Project p : managedProjects) {
            allManagedTasks.addAll(taskRepository.findByProjectId(p.getId()));
        }

        long totalTasks = allManagedTasks.size();
        long completed = allManagedTasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        long inProgress = allManagedTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long overdue = allManagedTasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now()) && t.getStatus() != TaskStatus.COMPLETED)
                .count();

        dto.setTotalTasks(totalTasks);
        dto.setCompletedTasks(completed);
        dto.setInProgressTasks(inProgress);
        dto.setPendingTasks(totalTasks - completed);
        dto.setOverdueTasks(overdue);
        dto.setOverallCompletionRate(totalTasks > 0 ? (completed * 100.0) / totalTasks : 0.0);

        dto.setRecentProjects(managedProjects.stream()
                .limit(5)
                .map(ProjectDto::new)
                .collect(Collectors.toList()));

        dto.setUpcomingTasks(allManagedTasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .sorted(Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(5)
                .map(TaskDto::new)
                .collect(Collectors.toList()));

        Map<String, Long> statusMap = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            statusMap.put(status.name(), allManagedTasks.stream().filter(t -> t.getStatus() == status).count());
        }
        dto.setTaskStatusBreakdown(statusMap);

        Map<String, Long> workloadMap = new HashMap<>();
        for (Task t : allManagedTasks) {
            if (t.getAssignee() != null) {
                workloadMap.put(t.getAssignee().getName(), workloadMap.getOrDefault(t.getAssignee().getName(), 0L) + 1);
            }
        }
        dto.setTeamWorkload(workloadMap);

        return dto;
    }

    @Transactional(readOnly = true)
    public DashboardMemberDto getMemberDashboard(String userEmail) {
        User member = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        DashboardMemberDto dto = new DashboardMemberDto();

        List<Task> assignedTasks = taskRepository.findByAssigneeId(member.getId());
        List<Project> assignedProjects = projectRepository.findByTeamMemberOrManagerId(member.getId());

        long total = assignedTasks.size();
        long completed = assignedTasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        long inProgress = assignedTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long overdue = assignedTasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now()) && t.getStatus() != TaskStatus.COMPLETED)
                .count();

        dto.setAssignedTasksCount(total);
        dto.setCompletedTasksCount(completed);
        dto.setInProgressTasksCount(inProgress);
        dto.setOverdueTasksCount(overdue);
        dto.setAssignedProjectsCount(assignedProjects.size());
        dto.setCompletionPercentage(total > 0 ? (completed * 100.0) / total : 0.0);

        dto.setMyTasks(assignedTasks.stream().map(TaskDto::new).collect(Collectors.toList()));
        dto.setMyProjects(assignedProjects.stream().map(ProjectDto::new).collect(Collectors.toList()));

        return dto;
    }
}

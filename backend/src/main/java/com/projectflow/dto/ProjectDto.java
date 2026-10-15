package com.projectflow.dto;

import com.projectflow.entity.Project;
import com.projectflow.entity.ProjectStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class ProjectDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
    private Integer progress;
    private UserDto projectManager;
    private Set<UserDto> teamMembers;
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectDto() {
    }

    public ProjectDto(Project project) {
        if (project != null) {
            this.id = project.getId();
            this.title = project.getTitle();
            this.description = project.getDescription();
            this.startDate = project.getStartDate();
            this.endDate = project.getEndDate();
            this.status = project.getStatus();
            this.progress = project.getProgress();
            if (project.getProjectManager() != null) {
                this.projectManager = new UserDto(project.getProjectManager());
            }
            if (project.getTeamMembers() != null) {
                this.teamMembers = project.getTeamMembers().stream()
                        .map(UserDto::new)
                        .collect(Collectors.toSet());
            }
            this.createdAt = project.getCreatedAt();
            this.updatedAt = project.getUpdatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public UserDto getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(UserDto projectManager) {
        this.projectManager = projectManager;
    }

    public Set<UserDto> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(Set<UserDto> teamMembers) {
        this.teamMembers = teamMembers;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

package com.projectflow.dto;

import com.projectflow.entity.Task;
import com.projectflow.entity.TaskPriority;
import com.projectflow.entity.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private Long projectId;
    private String projectTitle;
    private UserDto assignee;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDate startDate;
    private LocalDate dueDate;
    private boolean isOverdue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TaskDto() {
    }

    public TaskDto(Task task) {
        if (task != null) {
            this.id = task.getId();
            this.title = task.getTitle();
            this.description = task.getDescription();
            if (task.getProject() != null) {
                this.projectId = task.getProject().getId();
                this.projectTitle = task.getProject().getTitle();
            }
            if (task.getAssignee() != null) {
                this.assignee = new UserDto(task.getAssignee());
            }
            this.priority = task.getPriority();
            this.status = task.getStatus();
            this.startDate = task.getStartDate();
            this.dueDate = task.getDueDate();
            this.isOverdue = task.getDueDate() != null 
                    && task.getDueDate().isBefore(LocalDate.now()) 
                    && task.getStatus() != TaskStatus.COMPLETED;
            this.createdAt = task.getCreatedAt();
            this.updatedAt = task.getUpdatedAt();
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

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public UserDto getAssignee() {
        return assignee;
    }

    public void setAssignee(UserDto assignee) {
        this.assignee = assignee;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public boolean isOverdue() {
        return isOverdue;
    }

    public void setOverdue(boolean overdue) {
        isOverdue = overdue;
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

package com.projectflow.dto;

import java.util.List;

public class DashboardMemberDto {
    private long assignedTasksCount;
    private long completedTasksCount;
    private long inProgressTasksCount;
    private long overdueTasksCount;
    private long assignedProjectsCount;
    private double completionPercentage;

    private List<TaskDto> myTasks;
    private List<ProjectDto> myProjects;

    public DashboardMemberDto() {
    }

    public long getAssignedTasksCount() {
        return assignedTasksCount;
    }

    public void setAssignedTasksCount(long assignedTasksCount) {
        this.assignedTasksCount = assignedTasksCount;
    }

    public long getCompletedTasksCount() {
        return completedTasksCount;
    }

    public void setCompletedTasksCount(long completedTasksCount) {
        this.completedTasksCount = completedTasksCount;
    }

    public long getInProgressTasksCount() {
        return inProgressTasksCount;
    }

    public void setInProgressTasksCount(long inProgressTasksCount) {
        this.inProgressTasksCount = inProgressTasksCount;
    }

    public long getOverdueTasksCount() {
        return overdueTasksCount;
    }

    public void setOverdueTasksCount(long overdueTasksCount) {
        this.overdueTasksCount = overdueTasksCount;
    }

    public long getAssignedProjectsCount() {
        return assignedProjectsCount;
    }

    public void setAssignedProjectsCount(long assignedProjectsCount) {
        this.assignedProjectsCount = assignedProjectsCount;
    }

    public double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public List<TaskDto> getMyTasks() {
        return myTasks;
    }

    public void setMyTasks(List<TaskDto> myTasks) {
        this.myTasks = myTasks;
    }

    public List<ProjectDto> getMyProjects() {
        return myProjects;
    }

    public void setMyProjects(List<ProjectDto> myProjects) {
        this.myProjects = myProjects;
    }
}

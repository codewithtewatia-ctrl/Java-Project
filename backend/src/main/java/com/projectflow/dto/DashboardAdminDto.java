package com.projectflow.dto;

import java.util.Map;

public class DashboardAdminDto {
    private long totalUsers;
    private long activeUsers;
    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;

    private Map<String, Long> userRoleDistribution;
    private Map<String, Long> projectStatusDistribution;
    private Map<String, Long> taskStatusDistribution;
    private Map<String, Long> taskPriorityDistribution;

    public DashboardAdminDto() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public long getCompletedProjects() {
        return completedProjects;
    }

    public void setCompletedProjects(long completedProjects) {
        this.completedProjects = completedProjects;
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

    public Map<String, Long> getUserRoleDistribution() {
        return userRoleDistribution;
    }

    public void setUserRoleDistribution(Map<String, Long> userRoleDistribution) {
        this.userRoleDistribution = userRoleDistribution;
    }

    public Map<String, Long> getProjectStatusDistribution() {
        return projectStatusDistribution;
    }

    public void setProjectStatusDistribution(Map<String, Long> projectStatusDistribution) {
        this.projectStatusDistribution = projectStatusDistribution;
    }

    public Map<String, Long> getTaskStatusDistribution() {
        return taskStatusDistribution;
    }

    public void setTaskStatusDistribution(Map<String, Long> taskStatusDistribution) {
        this.taskStatusDistribution = taskStatusDistribution;
    }

    public Map<String, Long> getTaskPriorityDistribution() {
        return taskPriorityDistribution;
    }

    public void setTaskPriorityDistribution(Map<String, Long> taskPriorityDistribution) {
        this.taskPriorityDistribution = taskPriorityDistribution;
    }
}

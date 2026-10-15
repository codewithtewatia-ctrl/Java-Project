package com.projectflow.dto;

import java.util.List;
import java.util.Map;

public class DashboardManagerDto {
    private long totalManagedProjects;
    private long activeProjects;
    private long totalTasks;
    private long completedTasks;
    private long inProgressTasks;
    private long pendingTasks;
    private long overdueTasks;
    private double overallCompletionRate;

    private List<ProjectDto> recentProjects;
    private List<TaskDto> upcomingTasks;
    private Map<String, Long> taskStatusBreakdown;
    private Map<String, Long> teamWorkload;

    public DashboardManagerDto() {
    }

    public long getTotalManagedProjects() {
        return totalManagedProjects;
    }

    public void setTotalManagedProjects(long totalManagedProjects) {
        this.totalManagedProjects = totalManagedProjects;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(long activeProjects) {
        this.activeProjects = activeProjects;
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

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public double getOverallCompletionRate() {
        return overallCompletionRate;
    }

    public void setOverallCompletionRate(double overallCompletionRate) {
        this.overallCompletionRate = overallCompletionRate;
    }

    public List<ProjectDto> getRecentProjects() {
        return recentProjects;
    }

    public void setRecentProjects(List<ProjectDto> recentProjects) {
        this.recentProjects = recentProjects;
    }

    public List<TaskDto> getUpcomingTasks() {
        return upcomingTasks;
    }

    public void setUpcomingTasks(List<TaskDto> upcomingTasks) {
        this.upcomingTasks = upcomingTasks;
    }

    public Map<String, Long> getTaskStatusBreakdown() {
        return taskStatusBreakdown;
    }

    public void setTaskStatusBreakdown(Map<String, Long> taskStatusBreakdown) {
        this.taskStatusBreakdown = taskStatusBreakdown;
    }

    public Map<String, Long> getTeamWorkload() {
        return teamWorkload;
    }

    public void setTeamWorkload(Map<String, Long> teamWorkload) {
        this.teamWorkload = teamWorkload;
    }
}

package com.projectflow.dto;

import java.util.List;
import java.util.Map;

public class ReportsDto {
    private Map<String, Long> projectCompletionStats;
    private Map<String, Long> taskStatusBreakdown;
    private Map<String, Long> taskPriorityBreakdown;
    private Map<String, Map<String, Long>> teamPerformanceStats;
    private List<Map<String, Object>> monthlyActivity;

    public ReportsDto() {
    }

    public Map<String, Long> getProjectCompletionStats() {
        return projectCompletionStats;
    }

    public void setProjectCompletionStats(Map<String, Long> projectCompletionStats) {
        this.projectCompletionStats = projectCompletionStats;
    }

    public Map<String, Long> getTaskStatusBreakdown() {
        return taskStatusBreakdown;
    }

    public void setTaskStatusBreakdown(Map<String, Long> taskStatusBreakdown) {
        this.taskStatusBreakdown = taskStatusBreakdown;
    }

    public Map<String, Long> getTaskPriorityBreakdown() {
        return taskPriorityBreakdown;
    }

    public void setTaskPriorityBreakdown(Map<String, Long> taskPriorityBreakdown) {
        this.taskPriorityBreakdown = taskPriorityBreakdown;
    }

    public Map<String, Map<String, Long>> getTeamPerformanceStats() {
        return teamPerformanceStats;
    }

    public void setTeamPerformanceStats(Map<String, Map<String, Long>> teamPerformanceStats) {
        this.teamPerformanceStats = teamPerformanceStats;
    }

    public List<Map<String, Object>> getMonthlyActivity() {
        return monthlyActivity;
    }

    public void setMonthlyActivity(List<Map<String, Object>> monthlyActivity) {
        this.monthlyActivity = monthlyActivity;
    }
}

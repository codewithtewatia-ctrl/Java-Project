package com.projectflow.dto;

import jakarta.validation.constraints.NotNull;

public class TaskAssignRequest {

    @NotNull(message = "Assignee ID is required")
    private Long assigneeId;

    public TaskAssignRequest() {
    }

    public TaskAssignRequest(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }
}

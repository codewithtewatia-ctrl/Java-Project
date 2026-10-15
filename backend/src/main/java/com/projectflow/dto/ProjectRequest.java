package com.projectflow.dto;

import com.projectflow.entity.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.Set;

public class ProjectRequest {

    @NotBlank(message = "Project title is required")
    private String title;

    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status = ProjectStatus.PLANNING;
    private Long projectManagerId;
    private Set<Long> teamMemberIds;

    public ProjectRequest() {
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

    public Long getProjectManagerId() {
        return projectManagerId;
    }

    public void setProjectManagerId(Long projectManagerId) {
        this.projectManagerId = projectManagerId;
    }

    public Set<Long> getTeamMemberIds() {
        return teamMemberIds;
    }

    public void setTeamMemberIds(Set<Long> teamMemberIds) {
        this.teamMemberIds = teamMemberIds;
    }
}

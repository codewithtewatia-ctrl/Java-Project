package com.projectflow.repository;

import com.projectflow.entity.Task;
import com.projectflow.entity.TaskPriority;
import com.projectflow.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssigneeId(Long assigneeId);
    List<Task> findByProjectIdAndAssigneeId(Long projectId, Long assigneeId);

    long countByStatus(TaskStatus status);
    long countByPriority(TaskPriority priority);
    long countByProjectId(Long projectId);
    long countByProjectIdAndStatus(Long projectId, TaskStatus status);
    long countByAssigneeIdAndStatus(Long assigneeId, TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < :today AND t.status != 'COMPLETED'")
    long countOverdueTasks(@Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.dueDate < :today AND t.status != 'COMPLETED'")
    long countOverdueTasksByProject(@Param("projectId") Long projectId, @Param("today") LocalDate today);
}

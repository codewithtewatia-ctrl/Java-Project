package com.projectflow.repository;

import com.projectflow.entity.Project;
import com.projectflow.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByProjectManagerId(Long managerId);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.teamMembers m WHERE m.id = :userId OR p.projectManager.id = :userId")
    List<Project> findByTeamMemberOrManagerId(@Param("userId") Long userId);

    long countByStatus(ProjectStatus status);
}

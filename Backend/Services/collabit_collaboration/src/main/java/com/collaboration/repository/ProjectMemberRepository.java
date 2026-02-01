package com.collaboration.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.collaboration.entity.ProjectMember;

public interface ProjectMemberRepository
extends JpaRepository<ProjectMember, Long> {

List<ProjectMember> findByPitchId(Long pitchId);

boolean existsByPitchIdAndUserId(Long pitchId, Long userId);
}


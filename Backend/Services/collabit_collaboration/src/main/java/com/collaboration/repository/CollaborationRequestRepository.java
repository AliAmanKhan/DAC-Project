package com.collaboration.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.collaboration.entity.CollaborationRequest;

public interface CollaborationRequestRepository
extends JpaRepository<CollaborationRequest, Long> {

List<CollaborationRequest> findByPitchId(Long pitchId);

boolean existsByPitchIdAndRequesterUserId(Long pitchId, Long userId);
}

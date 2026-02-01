package com.collaboration.service;

import java.util.List;

import com.collaboration.dto.CollaborationRequestDto;
import com.collaboration.dto.ProjectMemberResponse;
import com.collaboration.entity.CollaborationRequest;

public interface CollaborationService {

    void requestToJoin(Long userId, CollaborationRequestDto dto);

    void actOnRequest(Long adminUserId, Long requestId, boolean accept);

    List<ProjectMemberResponse> getProjectMembers(Long pitchId);

    List<CollaborationRequest> getRequestsForPitch(Long pitchId);
}

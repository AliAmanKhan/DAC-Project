package com.collaboration.service;

import java.util.List;

import com.collaboration.dto.CollaborationNotificationDto;
import com.collaboration.dto.CollaborationRequestDto;
import com.collaboration.dto.ProjectMemberResponse;
import com.collaboration.entity.CollaborationRequest;

public interface CollaborationService {

    void requestToJoin(Long userId, CollaborationRequestDto dto);

    void actOnRequest(Long adminUserId, Long requestId, boolean accept);

    List<ProjectMemberResponse> getProjectMembers(Long pitchId);

    List<CollaborationRequest> getRequestsForPitch(Long pitchId);
    
    void withdrawRequest(Long userId, Long requestId);

    List<CollaborationNotificationDto> getNotificationsForPitchOwner(Long pitchOwnerId);

    List<CollaborationNotificationDto> getUnreadNotifications(Long pitchOwnerId);

    void markNotificationAsRead(Long notificationId, Long pitchOwnerId);

    List<CollaborationNotificationDto> getAllNotifications();

}

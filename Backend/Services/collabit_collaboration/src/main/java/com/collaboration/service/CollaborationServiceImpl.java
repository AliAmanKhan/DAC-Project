package com.collaboration.service;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.collaboration.dto.CollaborationNotificationDto;
import com.collaboration.dto.CollaborationRequestDto;
import com.collaboration.dto.ProjectMemberResponse;
import com.collaboration.entity.CollaborationNotification;
import com.collaboration.entity.CollaborationRequest;
import com.collaboration.entity.ProjectMember;
import com.collaboration.enums.CollaborationStatus;
import com.collaboration.enums.NotificationStatus;
import com.collaboration.enums.ProjectRole;
import com.collaboration.repository.CollaborationNotificationRepository;
import com.collaboration.repository.CollaborationRequestRepository;
import com.collaboration.repository.ProjectMemberRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CollaborationServiceImpl implements CollaborationService {

    private final CollaborationRequestRepository requestRepo;
    private final ProjectMemberRepository memberRepo;
    private final CollaborationNotificationRepository notificationRepo;
    private final ModelMapper modelMapper;

    @Override
    public void requestToJoin(Long userId, CollaborationRequestDto dto) {

        if (requestRepo.existsByPitchIdAndRequesterUserId(
                dto.getPitchId(), userId)) {
            throw new RuntimeException("Collaboration request already exists");
        }

        CollaborationRequest request =
                modelMapper.map(dto, CollaborationRequest.class);

        request.setRequesterUserId(userId);
        request.setStatus(CollaborationStatus.REQUESTED);
        request.setCreatedAt(LocalDateTime.now());

        CollaborationRequest savedRequest = requestRepo.save(request);

        // Create notification for pitch owner
        // For now, we'll assume the pitch owner is stored in the pitch service
        // We can fetch it using REST call or add it to the DTO
        Long pitchOwnerId = getPitchOwnerId(dto.getPitchId());
        if (pitchOwnerId != null) {
            CollaborationNotification notification = new CollaborationNotification();
            notification.setPitchOwnerId(pitchOwnerId);
            notification.setCollaborationRequest(savedRequest);
            notification.setStatus(NotificationStatus.UNREAD);
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepo.save(notification);
        }
    }

    @SuppressWarnings("unused")
    private Long getPitchOwnerId(Long pitchId) {
        try {
            // Call the pitch service to get pitch owner
            // Adjust the URL based on your pitch service endpoint
            // String pitchServiceUrl = "http://localhost:8081/pitches/" + pitchId;
            // You'll need to configure RestTemplate as a bean in Application.java
            // For now, returning null - implement actual REST call
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public void actOnRequest(
            Long adminUserId,
            Long requestId,
            boolean accept
    ) {
        CollaborationRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != CollaborationStatus.REQUESTED) {
            throw new RuntimeException("Request already processed");
        }

        request.setStatus(
                accept ? CollaborationStatus.ACCEPTED : CollaborationStatus.REJECTED
        );
        request.setUpdatedAt(LocalDateTime.now());

        requestRepo.save(request);

        if (accept && !memberRepo.existsByPitchIdAndUserId(
                request.getPitchId(), request.getRequesterUserId())) {

            ProjectMember member = new ProjectMember();
            member.setPitchId(request.getPitchId());
            member.setUserId(request.getRequesterUserId());
            member.setRole(ProjectRole.MEMBER);
            member.setJoinedAt(LocalDateTime.now());

            memberRepo.save(member);
        }

        // Mark notification as read
        List<CollaborationNotification> notifications = 
            notificationRepo.findByCollaborationRequestId(requestId);
        notifications.forEach(n -> {
            n.setStatus(NotificationStatus.READ);
            n.setReadAt(LocalDateTime.now());
            notificationRepo.save(n);
        });
    }

    @Override
    public List<ProjectMemberResponse> getProjectMembers(Long pitchId) {

        return memberRepo.findByPitchId(pitchId)
                .stream()
                .map(member ->
                        modelMapper.map(member, ProjectMemberResponse.class)
                )
                .toList();
    }

    @Override
    public List<CollaborationRequest> getRequestsForPitch(Long pitchId) {
        return requestRepo.findByPitchId(pitchId);
    }
    
    
    @Override
    public void withdrawRequest(Long userId, Long requestId) {

        CollaborationRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getRequesterUserId().equals(userId)) {
            throw new RuntimeException("You are not allowed to withdraw this request");
        }

        if (request.getStatus() != CollaborationStatus.REQUESTED) {
            throw new RuntimeException("Request cannot be withdrawn");
        }

        request.setStatus(CollaborationStatus.WITHDRAWN);
        request.setUpdatedAt(LocalDateTime.now());

        requestRepo.save(request);
        
        // Delete associated notifications
        notificationRepo.deleteByCollaborationRequestId(requestId);
    }

    @Override
    public List<CollaborationNotificationDto> getNotificationsForPitchOwner(Long pitchOwnerId) {
        return notificationRepo.findByPitchOwnerId(pitchOwnerId)
                .stream()
                .map(notification -> mapNotificationToDto(notification))
                .toList();
    }

    @Override
    public List<CollaborationNotificationDto> getUnreadNotifications(Long pitchOwnerId) {
        return notificationRepo.findByPitchOwnerIdAndStatus(pitchOwnerId, NotificationStatus.UNREAD)
                .stream()
                .map(notification -> mapNotificationToDto(notification))
                .toList();
    }

    @Override
    public void markNotificationAsRead(Long notificationId, Long pitchOwnerId) {
        CollaborationNotification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getPitchOwnerId().equals(pitchOwnerId)) {
            throw new RuntimeException("You are not authorized to read this notification");
        }

        notification.setStatus(NotificationStatus.READ);
        notification.setReadAt(LocalDateTime.now());
        notificationRepo.save(notification);
    }

    private CollaborationNotificationDto mapNotificationToDto(CollaborationNotification notification) {
        CollaborationNotificationDto dto = new CollaborationNotificationDto();
        CollaborationRequest request = notification.getCollaborationRequest();

        dto.setNotificationId(notification.getId());
        dto.setPitchId(request.getPitchId());
        dto.setRequesterUserId(request.getRequesterUserId());
        dto.setMessage(request.getMessage());
        dto.setStatus(notification.getStatus());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setReadAt(notification.getReadAt());

        // Fetch requester details from User Service
        try {
            // Call user service to get user details
            // This is a placeholder - implement actual REST call
            dto.setRequesterUsername("user_" + request.getRequesterUserId());
            dto.setRequesterEmail("user_" + request.getRequesterUserId() + "@example.com");
        } catch (Exception e) {
            // Log error and set defaults
        }

        return dto;
    }

    @Override
    public List<CollaborationNotificationDto> getAllNotifications() {
        List<CollaborationNotification> notifications = notificationRepo.findAll();
        return notifications.stream()
                .map(this::toNotificationDto)
                .toList();
    }

}

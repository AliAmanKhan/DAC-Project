package com.collaboration.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collaboration.dto.CollaborationActionRequest;
import com.collaboration.dto.CollaborationNotificationDto;
import com.collaboration.dto.CollaborationRequestDto;
import com.collaboration.dto.ProjectMemberResponse;
import com.collaboration.entity.CollaborationRequest;
import com.collaboration.service.CollaborationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/collaborations")
@RequiredArgsConstructor
public class CollaborationController {

    private final CollaborationService service;

    @PostMapping("/request")
    public ResponseEntity<Void> requestToJoin(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestBody CollaborationRequestDto dto
    ) {
        service.requestToJoin(userId, dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/request/{id}")
    public ResponseEntity<Void> actOnRequest(
            @RequestHeader("X-USER-ID") Long adminId,
            @PathVariable Long id,
            @RequestBody CollaborationActionRequest request
    ) {
        service.actOnRequest(adminId, id, request.isAccept());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pitch/{pitchId}/requests")
    public ResponseEntity<List<CollaborationRequest>> getRequests(
            @PathVariable Long pitchId
    ) {
        return ResponseEntity.ok(service.getRequestsForPitch(pitchId));
    }

    @GetMapping("/pitch/{pitchId}/members")
    public ResponseEntity<List<ProjectMemberResponse>> members(
            @PathVariable Long pitchId
    ) {
        return ResponseEntity.ok(service.getProjectMembers(pitchId));
    }
    
    @PutMapping("/request/{id}/withdraw")
    public ResponseEntity<Void> withdrawRequest(
            @RequestHeader("X-USER-ID") Long userId,
            @PathVariable Long id
    ) {
        service.withdrawRequest(userId, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<CollaborationNotificationDto>> getNotifications(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(service.getNotificationsForPitchOwner(userId));
    }

    @GetMapping("/notifications/{userId}/unread")
    public ResponseEntity<List<CollaborationNotificationDto>> getUnreadNotifications(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(service.getUnreadNotifications(userId));
    }

    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(
            @RequestHeader("X-USER-ID") Long userId,
            @PathVariable Long notificationId
    ) {
        service.markNotificationAsRead(notificationId, userId);
        return ResponseEntity.ok().build();
    }

    // Debug endpoint - get all notifications from database
    @GetMapping("/debug/all-notifications")
    public ResponseEntity<List<CollaborationNotificationDto>> getAllNotifications() {
        return ResponseEntity.ok(service.getAllNotifications());
    }

}

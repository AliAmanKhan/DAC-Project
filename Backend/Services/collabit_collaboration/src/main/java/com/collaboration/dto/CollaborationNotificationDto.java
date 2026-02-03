package com.collaboration.dto;

import java.time.LocalDateTime;

import com.collaboration.enums.NotificationStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CollaborationNotificationDto {
    private Long notificationId;
    private Long pitchId;
    private Long requesterUserId;
    private String requesterUsername;
    private String requesterEmail;
    private String message;
    private NotificationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}

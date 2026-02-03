package com.collaboration.dto;

import java.time.LocalDateTime;

import com.collaboration.enums.CollaborationStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CollaborationRequestDetailDto {
    private Long requestId;
    private Long pitchId;
    private Long requesterUserId;
    private String requesterUsername;
    private String requesterEmail;
    private String message;
    private CollaborationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

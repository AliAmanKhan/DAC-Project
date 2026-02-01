package com.collaboration.entity;

import java.time.LocalDateTime;

import com.collaboration.enums.CollaborationStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "collaboration_requests")
@Getter
@Setter
public class CollaborationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long pitchId;

    private Long requesterUserId;

    @Enumerated(EnumType.STRING)
    private CollaborationStatus status;

    private String message;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

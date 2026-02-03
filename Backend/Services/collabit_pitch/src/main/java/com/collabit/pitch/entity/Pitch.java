package com.collabit.pitch.entity;

import java.time.LocalDateTime;

import com.collabit.pitch.enums.PitchStatus;
import com.collabit.pitch.enums.PitchVisibility;

import jakarta.persistence.Column;
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
@Table(name = "pitches")
@Getter
@Setter
public class Pitch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pitchId;

    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private String title;

    @Column(length = 3000)
    private String description;

    @Enumerated(EnumType.STRING)
    private PitchVisibility visibility;

    @Enumerated(EnumType.STRING)
    private PitchStatus status;

    private Integer requiredCollaborators;

    @Column(length = 1000)
    private String requiredSkills;

    @Column(length = 1000)
    private String collaborators;

    @Column(length = 500)
    private String tags;

    @Column(length = 2000)
    private String image;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

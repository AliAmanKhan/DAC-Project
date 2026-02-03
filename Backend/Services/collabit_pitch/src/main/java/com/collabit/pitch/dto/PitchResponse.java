package com.collabit.pitch.dto;

import com.collabit.pitch.enums.PitchStatus;
import com.collabit.pitch.enums.PitchVisibility;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PitchResponse {

    private Long pitchId;
    private String title;
    private String description;
    private PitchVisibility visibility;
    private PitchStatus status;
    private Integer requiredCollaborators;
    private String requiredSkills;
    private String collaborators;
    private String tags;
    private String image;
    private Long ownerId;
}

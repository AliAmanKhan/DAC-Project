package com.collabit.pitch.dto;

import com.collabit.pitch.enums.PitchVisibility;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PitchCreateRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private PitchVisibility visibility;

    @NotNull
    private Integer requiredCollaborators;

    private String requiredSkills;

    private String collaborators;

    private String tags;

    // Base64 image string or URL (optional)
    private String image;
}

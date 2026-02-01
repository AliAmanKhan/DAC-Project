package com.collaboration.dto;

import java.time.LocalDateTime;

import com.collaboration.enums.ProjectRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectMemberResponse {
    private Long userId;
    private ProjectRole role;
    private LocalDateTime joinedAt;
}

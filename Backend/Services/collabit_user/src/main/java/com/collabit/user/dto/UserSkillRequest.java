package com.collabit.user.dto;

import com.collabit.user.enums.SkillLevel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSkillRequest {
    private String skillName;
    private SkillLevel level;
    private Integer experienceYears;
}


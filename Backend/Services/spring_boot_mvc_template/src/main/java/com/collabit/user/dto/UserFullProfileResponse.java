package com.collabit.user.dto;

import java.util.List;

import com.collabit.user.entity.Education;
import com.collabit.user.entity.SocialLink;
import com.collabit.user.entity.UserSkill;
import com.collabit.user.enums.ProfileVisibility;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserFullProfileResponse {

    private Long userId;
    private String fullName;
    private String username;
    private String bio;
    private String college;
    private String branch;
    private Integer graduationYear;
    private ProfileVisibility visibility;

    private List<SocialLink> socialLinks;
    private List<UserSkill> skills;
    private List<Education> education;

    private UserStatsResponse stats;
    private List<String> badges;
}


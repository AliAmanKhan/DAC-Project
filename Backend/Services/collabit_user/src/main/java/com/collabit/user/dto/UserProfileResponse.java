package com.collabit.user.dto;

import com.collabit.user.enums.ProfileVisibility;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserProfileResponse {

    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String bio;
    private String profileImage;
    private String college;
    private String branch;
    private Integer graduationYear;
    private ProfileVisibility visibility;
}

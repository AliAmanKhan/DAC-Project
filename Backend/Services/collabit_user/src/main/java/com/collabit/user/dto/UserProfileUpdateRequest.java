package com.collabit.user.dto;

import java.time.LocalDate;

import com.collabit.user.enums.Gender;
import com.collabit.user.enums.ProfileVisibility;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileUpdateRequest {

    @NotBlank
    private String fullName;

    private String bio;

    private String phone;

    private LocalDate dob;

    private Gender gender;

    private String profileImage;

    private String college;
    private String branch;
    private Integer graduationYear;

    @NotNull
    private ProfileVisibility visibility;
}

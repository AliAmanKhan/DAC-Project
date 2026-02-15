package com.collabit.user.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.collabit.user.enums.Gender;
import com.collabit.user.enums.ProfileVisibility;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId; // comes from Auth service

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    private String phone;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String bio;

    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String profileImage;

    private String college;
    private String branch;
    private Integer graduationYear;

    @Enumerated(EnumType.STRING)
    private ProfileVisibility visibility;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

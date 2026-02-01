package com.collabit.user.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabit.user.dto.EducationRequest;
import com.collabit.user.dto.SocialLinkRequest;
import com.collabit.user.dto.UserFullProfileResponse;
import com.collabit.user.dto.UserProfileResponse;
import com.collabit.user.dto.UserProfileUpdateRequest;
import com.collabit.user.dto.UserSkillRequest;
import com.collabit.user.service.UserProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService service;

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @RequestHeader("X-USER-ID") Long userId,
            @Valid @RequestBody UserProfileUpdateRequest request
    ) {
        return ResponseEntity.ok(
                
                service.updateProfile(userId, request)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @RequestHeader("X-USER-ID") Long userId
    ) {
        return ResponseEntity.ok(
                service.getMyProfile(userId)
        );
    }
    
    @GetMapping("/{userId}/full")
    public ResponseEntity<UserFullProfileResponse> getFullUserProfile(
            @PathVariable Long userId,
            @RequestHeader("X-USER-ID") Long viewerId
    ) {
        // System.out.println("Fetching full profile for userId: " + userId + " viewed by: " + viewerId);
        return ResponseEntity.ok(
                service.getFullProfile(userId, viewerId)
        );
    }
    
    @PutMapping("/me/social-links")
    public ResponseEntity<Void> updateSocialLinks(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestBody List<SocialLinkRequest> request
    ) {
        service.updateSocialLinks(userId, request);
        return ResponseEntity.ok().build();
    }

    
    @PutMapping("/me/skills")
    public ResponseEntity<Void> updateSkills(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestBody List<UserSkillRequest> request
    ) {
        service.updateSkills(userId, request);
        return ResponseEntity.ok().build();
    }

    
    @PutMapping("/me/education")
    public ResponseEntity<Void> updateEducation(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestBody List<EducationRequest> request
    ) {
        service.updateEducation(userId, request);
        return ResponseEntity.ok().build();
    }

    
    
    
    
}


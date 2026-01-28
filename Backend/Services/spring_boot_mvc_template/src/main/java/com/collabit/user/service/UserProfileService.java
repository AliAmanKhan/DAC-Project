package com.collabit.user.service;

import java.util.List;

import com.collabit.user.dto.EducationRequest;
import com.collabit.user.dto.SocialLinkRequest;
import com.collabit.user.dto.UserFullProfileResponse;
import com.collabit.user.dto.UserProfileResponse;
import com.collabit.user.dto.UserProfileUpdateRequest;
import com.collabit.user.dto.UserSkillRequest;

public interface UserProfileService {
	UserProfileResponse updateProfile(
            Long userId,
            UserProfileUpdateRequest request
    );

    UserProfileResponse getMyProfile(Long userId) ;
    
    UserFullProfileResponse getFullProfile(
            Long requestedUserId,
            Long viewerUserId
    );
    void updateSocialLinks(Long userId, List<SocialLinkRequest> request);

    void updateSkills(Long userId, List<UserSkillRequest> request);

    void updateEducation(Long userId, List<EducationRequest> request);
}

package com.collabit.user.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.collabit.user.dto.EducationRequest;
import com.collabit.user.dto.SocialLinkRequest;
import com.collabit.user.dto.UserFullProfileResponse;
import com.collabit.user.dto.UserProfileResponse;
import com.collabit.user.dto.UserProfileUpdateRequest;
import com.collabit.user.dto.UserSkillRequest;
import com.collabit.user.dto.UserStatsResponse;
import com.collabit.user.entity.Education;
import com.collabit.user.entity.SocialLink;
import com.collabit.user.entity.UserProfile;
import com.collabit.user.entity.UserSkill;
import com.collabit.user.entity.UserStats;
import com.collabit.user.enums.ProfileVisibility;
import com.collabit.user.exception.ResourceNotFoundException;
import com.collabit.user.repository.BadgeRepository;
import com.collabit.user.repository.EducationRepository;
import com.collabit.user.repository.FollowRepository;
import com.collabit.user.repository.SocialLinkRepository;
import com.collabit.user.repository.UserProfileRepository;
import com.collabit.user.repository.UserSkillRepository;
import com.collabit.user.repository.UserStatsRepository;

import jakarta.transaction.Transactional;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository repository;
    private final SocialLinkRepository socialRepo;
    private final UserSkillRepository skillRepo;
    private final EducationRepository educationRepo;
    private final FollowRepository followRepo;
    private final BadgeRepository badgeRepo;
    private final UserStatsRepository statsRepo;
    private final EntityManager entityManager;

    // ===================== PROFILE =====================

    @Override
    public UserProfileResponse updateProfile(
            Long userId,
            UserProfileUpdateRequest request
    ) {
        UserProfile profile = repository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User profile not found"));

        profile.setFullName(request.getFullName());
        profile.setBio(request.getBio());
        profile.setDob(request.getDob());
        profile.setGender(request.getGender());
        profile.setProfileImage(request.getProfileImage());
        profile.setCollege(request.getCollege());
        profile.setBranch(request.getBranch());
        profile.setGraduationYear(request.getGraduationYear());
        profile.setVisibility(request.getVisibility());
        profile.setUpdatedAt(LocalDateTime.now());

        repository.save(profile);
        return mapToResponse(profile);
    }

    @Override
    public UserProfileResponse getMyProfile(Long userId) {
        UserProfile profile = repository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User profile not found"));

        return mapToResponse(profile);
    }

    // ===================== FULL PROFILE =====================

    @Override
    public UserFullProfileResponse getFullProfile(
            Long requestedUserId,
            Long viewerUserId
    ) {
        UserProfile profile = repository.findById(requestedUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        applyVisibility(profile, viewerUserId);

        List<SocialLink> socialLinks = socialRepo.findByUserId(requestedUserId);
        List<UserSkill> skills = skillRepo.findByUserId(requestedUserId);
        List<Education> education = educationRepo.findByUserId(requestedUserId);

        long followers = followRepo.countByFollowingId(requestedUserId);
        long following = followRepo.countByFollowerId(requestedUserId);

        UserStats stats = statsRepo.findById(requestedUserId)
                .orElse(new UserStats());

        List<String> badges = badgeRepo.findByUserId(requestedUserId)
                .stream()
                .map(b -> b.getBadgeType().name())
                .toList();

        return UserFullProfileResponse.builder()
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .username(profile.getUsername())
                .bio(profile.getBio())
                .college(profile.getCollege())
                .branch(profile.getBranch())
                .graduationYear(profile.getGraduationYear())
                .visibility(profile.getVisibility())
                .socialLinks(socialLinks)
                .skills(skills)
                .education(education)
                .stats(UserStatsResponse.builder()
                        .credits(stats.getTotalCredits())
                        .followers(followers)
                        .following(following)
                        .projects(stats.getTotalProjects())
                        .build())
                .badges(badges)
                .build();
    }

    // ===================== SOCIAL LINKS =====================

    @Override
    public void updateSocialLinks(Long userId, List<SocialLinkRequest> request) {
        socialRepo.deleteByUserId(userId);
        entityManager.flush();

        List<SocialLink> links = request.stream()
                .map(r -> SocialLink.builder()
                        .userId(userId)
                        .platform(r.getPlatform())
                        .url(r.getUrl())
                        .build())
                .toList();

        socialRepo.saveAll(links);
    }

    // ===================== SKILLS =====================

    @Override
    public void updateSkills(Long userId, List<UserSkillRequest> request) {
        skillRepo.deleteByUserId(userId);
        entityManager.flush();

        List<UserSkill> skills = request.stream()
                .map(r -> UserSkill.builder()
                        .userId(userId)
                        .skillName(r.getSkillName())
                        .level(r.getLevel())
                        .experienceYears(r.getExperienceYears())
                        .createdAt(LocalDateTime.now())
                        .build())
                .toList();

        skillRepo.saveAll(skills);
    }

    // ===================== EDUCATION =====================

    @Override
    public void updateEducation(Long userId, List<EducationRequest> request) {
        educationRepo.deleteByUserId(userId);
        entityManager.flush();

        List<Education> educationList = request.stream()
                .map(r -> Education.builder()
                        .userId(userId)
                        .institute(r.getInstitute())
                        .degree(r.getDegree())
                        .field(r.getField())
                        .startYear(r.getStartYear())
                        .endYear(r.getEndYear())
                        .build())
                .toList();

        educationRepo.saveAll(educationList);
    }

    // ===================== HELPERS =====================

    private UserProfileResponse mapToResponse(UserProfile profile) {
        return UserProfileResponse.builder()
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .username(profile.getUsername())
                .email(profile.getEmail())
                .bio(profile.getBio())
                .profileImage(profile.getProfileImage())
                .college(profile.getCollege())
                .branch(profile.getBranch())
                .graduationYear(profile.getGraduationYear())
                .visibility(profile.getVisibility())
                .build();
    }

    private void applyVisibility(UserProfile profile, Long viewerId) {
        if (profile.getVisibility() == ProfileVisibility.PRIVATE &&
                !profile.getUserId().equals(viewerId)) {
            throw new RuntimeException("Profile is private");
        }
    }
}

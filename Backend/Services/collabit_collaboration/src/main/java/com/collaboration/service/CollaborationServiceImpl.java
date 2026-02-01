package com.collaboration.service;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.collaboration.dto.CollaborationRequestDto;
import com.collaboration.dto.ProjectMemberResponse;
import com.collaboration.entity.CollaborationRequest;
import com.collaboration.entity.ProjectMember;
import com.collaboration.enums.CollaborationStatus;
import com.collaboration.enums.ProjectRole;
import com.collaboration.repository.CollaborationRequestRepository;
import com.collaboration.repository.ProjectMemberRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CollaborationServiceImpl implements CollaborationService {

    private final CollaborationRequestRepository requestRepo;
    private final ProjectMemberRepository memberRepo;
    private final ModelMapper modelMapper;

    @Override
    public void requestToJoin(Long userId, CollaborationRequestDto dto) {

        if (requestRepo.existsByPitchIdAndRequesterUserId(
                dto.getPitchId(), userId)) {
            throw new RuntimeException("Collaboration request already exists");
        }

        CollaborationRequest request =
                modelMapper.map(dto, CollaborationRequest.class);

        request.setRequesterUserId(userId);
        request.setStatus(CollaborationStatus.REQUESTED);
        request.setCreatedAt(LocalDateTime.now());

        requestRepo.save(request);
    }

    @Override
    public void actOnRequest(
            Long adminUserId,
            Long requestId,
            boolean accept
    ) {
        CollaborationRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != CollaborationStatus.REQUESTED) {
            throw new RuntimeException("Request already processed");
        }

        request.setStatus(
                accept ? CollaborationStatus.ACCEPTED : CollaborationStatus.REJECTED
        );
        request.setUpdatedAt(LocalDateTime.now());

        requestRepo.save(request);

        if (accept && !memberRepo.existsByPitchIdAndUserId(
                request.getPitchId(), request.getRequesterUserId())) {

            ProjectMember member = new ProjectMember();
            member.setPitchId(request.getPitchId());
            member.setUserId(request.getRequesterUserId());
            member.setRole(ProjectRole.MEMBER);
            member.setJoinedAt(LocalDateTime.now());

            memberRepo.save(member);
        }
    }

    @Override
    public List<ProjectMemberResponse> getProjectMembers(Long pitchId) {

        return memberRepo.findByPitchId(pitchId)
                .stream()
                .map(member ->
                        modelMapper.map(member, ProjectMemberResponse.class)
                )
                .toList();
    }

    @Override
    public List<CollaborationRequest> getRequestsForPitch(Long pitchId) {
        return requestRepo.findByPitchId(pitchId);
    }
    
    
    @Override
    public void withdrawRequest(Long userId, Long requestId) {

        CollaborationRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getRequesterUserId().equals(userId)) {
            throw new RuntimeException("You are not allowed to withdraw this request");
        }

        if (request.getStatus() != CollaborationStatus.REQUESTED) {
            throw new RuntimeException("Request cannot be withdrawn");
        }

        request.setStatus(CollaborationStatus.WITHDRAWN);
        request.setUpdatedAt(LocalDateTime.now());

        requestRepo.save(request);
    }

}

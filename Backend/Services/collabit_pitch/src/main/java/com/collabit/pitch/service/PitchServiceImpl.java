package com.collabit.pitch.service;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.collabit.pitch.dto.PitchCreateRequest;
import com.collabit.pitch.dto.PitchResponse;
import com.collabit.pitch.dto.PitchUpdateRequest;
import com.collabit.pitch.entity.Pitch;
import com.collabit.pitch.enums.PitchStatus;
import com.collabit.pitch.exception.ResourceNotFoundException;
import com.collabit.pitch.repository.PitchRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PitchServiceImpl implements PitchService {

    private final PitchRepository repository;
    private final ModelMapper modelMapper;

    @Override
    public PitchResponse createPitch(Long userId, PitchCreateRequest request) {

        Pitch pitch = modelMapper.map(request, Pitch.class);
        pitch.setOwnerId(userId);
        pitch.setStatus(PitchStatus.OPEN);
        pitch.setCreatedAt(LocalDateTime.now());

        repository.save(pitch);
        return modelMapper.map(pitch, PitchResponse.class);
    }

    @Override
    public PitchResponse updatePitch(
            Long userId,
            Long pitchId,
            PitchUpdateRequest request
    ) {
        Pitch pitch = repository.findById(pitchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pitch not found"));

        if (!pitch.getOwnerId().equals(userId)) {
            throw new RuntimeException("You are not allowed to update this pitch");
        }

        modelMapper.map(request, pitch); // 🔥 partial update
        pitch.setUpdatedAt(LocalDateTime.now());

        repository.save(pitch);
        return modelMapper.map(pitch, PitchResponse.class);
    }

    @Override
    public void deletePitch(Long userId, Long pitchId) {
        Pitch pitch = repository.findById(pitchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pitch not found"));

        if (!pitch.getOwnerId().equals(userId)) {
            throw new RuntimeException("You are not allowed to delete this pitch");
        }

        repository.delete(pitch);
    }

    @Override
    public PitchResponse getPitch(Long pitchId) {
        Pitch pitch = repository.findById(pitchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pitch not found"));

        return modelMapper.map(pitch, PitchResponse.class);
    }

    @Override
    public List<PitchResponse> getMyPitches(Long userId) {
        return repository.findByOwnerId(userId)
                .stream()
                .map(p -> modelMapper.map(p, PitchResponse.class))
                .toList();
    }
}

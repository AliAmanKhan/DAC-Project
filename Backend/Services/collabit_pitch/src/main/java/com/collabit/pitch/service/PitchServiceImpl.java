package com.collabit.pitch.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.collabit.pitch.dto.PitchCreateRequest;
import com.collabit.pitch.dto.PitchResponse;
import com.collabit.pitch.dto.PitchUpdateRequest;
import com.collabit.pitch.entity.Pitch;
import com.collabit.pitch.enums.PitchStatus;
import com.collabit.pitch.enums.PitchVisibility;
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

    @Override
    public List<PitchResponse> getRecommendedPitches(Long userId, List<String> interests, Integer limit) {
        // fetch candidates excluding user's own pitches
        List<Pitch> candidates = repository.findByOwnerIdNot(userId);

        // keep only open pitches visible to everyone
        List<Pitch> filtered = candidates.stream()
                .filter(p -> p.getStatus() == PitchStatus.OPEN)
                .filter(p -> p.getVisibility() == null || p.getVisibility() == PitchVisibility.PUBLIC)
                .toList();

        int max = (limit == null) ? 10 : limit;

        if (interests != null && !interests.isEmpty()) {
            Set<String> interestSet = interests.stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());

            return filtered.stream()
                    .map(p -> {
                        int matches = 0;
                        if (p.getTags() != null) {
                            Set<String> tagSet = Arrays.stream(p.getTags().split(","))
                                    .map(String::trim)
                                    .map(String::toLowerCase)
                                    .collect(Collectors.toSet());
                            tagSet.retainAll(interestSet);
                            matches = tagSet.size();
                        }
                        return new java.util.AbstractMap.SimpleEntry<>(p, matches);
                    })
                    .filter(e -> e.getValue() > 0)
                    .sorted(Comparator.<java.util.Map.Entry<Pitch, Integer>>comparingInt(java.util.Map.Entry::getValue).reversed()
                            .thenComparing(e -> e.getKey().getCreatedAt(), Comparator.reverseOrder()))
                    .limit(max)
                    .map(e -> modelMapper.map(e.getKey(), PitchResponse.class))
                    .toList();
        }

        return filtered.stream()
                .sorted(Comparator.comparing(Pitch::getCreatedAt).reversed())
                .limit(max)
                .map(p -> modelMapper.map(p, PitchResponse.class))
                .toList();
    }
} 

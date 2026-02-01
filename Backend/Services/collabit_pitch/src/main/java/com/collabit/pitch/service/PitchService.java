package com.collabit.pitch.service;

import java.util.List;

import com.collabit.pitch.dto.PitchCreateRequest;
import com.collabit.pitch.dto.PitchResponse;
import com.collabit.pitch.dto.PitchUpdateRequest;

public interface PitchService {

    PitchResponse createPitch(Long userId, PitchCreateRequest request);

    PitchResponse updatePitch(Long userId, Long pitchId, PitchUpdateRequest request);

    void deletePitch(Long userId, Long pitchId);

    PitchResponse getPitch(Long pitchId);

    List<PitchResponse> getMyPitches(Long userId);
}

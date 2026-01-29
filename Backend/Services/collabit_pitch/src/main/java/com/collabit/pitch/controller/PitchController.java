package com.collabit.pitch.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.collabit.pitch.dto.PitchCreateRequest;
import com.collabit.pitch.dto.PitchResponse;
import com.collabit.pitch.dto.PitchUpdateRequest;
import com.collabit.pitch.service.PitchService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pitches")
@RequiredArgsConstructor
public class PitchController {

    private final PitchService service;

    @PostMapping
    public ResponseEntity<PitchResponse> createPitch(
            @RequestHeader("X-USER-ID") Long userId,
            @Valid @RequestBody PitchCreateRequest request
    ) {
        return ResponseEntity.ok(service.createPitch(userId, request));
    }

    @PutMapping("/{pitchId}")
    public ResponseEntity<PitchResponse> updatePitch(
            @RequestHeader("X-USER-ID") Long userId,
            @PathVariable Long pitchId,
            @RequestBody PitchUpdateRequest request
    ) {
        return ResponseEntity.ok(
                service.updatePitch(userId, pitchId, request)
        );
    }

    @DeleteMapping("/{pitchId}")
    public ResponseEntity<Void> deletePitch(
            @RequestHeader("X-USER-ID") Long userId,
            @PathVariable Long pitchId
    ) {
        service.deletePitch(userId, pitchId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{pitchId}")
    public ResponseEntity<PitchResponse> getPitch(
            @PathVariable Long pitchId
    ) {
        return ResponseEntity.ok(service.getPitch(pitchId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<PitchResponse>> getMyPitches(
            @RequestHeader("X-USER-ID") Long userId
    ) {
        return ResponseEntity.ok(service.getMyPitches(userId));
    }
}

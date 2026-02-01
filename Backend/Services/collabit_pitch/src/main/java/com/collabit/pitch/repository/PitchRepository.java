package com.collabit.pitch.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.collabit.pitch.entity.Pitch;

public interface PitchRepository extends JpaRepository<Pitch, Long> {

    List<Pitch> findByOwnerId(Long ownerId);
}

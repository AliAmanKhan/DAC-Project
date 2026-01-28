package com.collabit.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabit.user.entity.Badge;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    List<Badge> findByUserId(Long userId);
}


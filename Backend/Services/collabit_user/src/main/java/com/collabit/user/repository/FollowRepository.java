package com.collabit.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabit.user.enums.Follow;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    // how many users follow this user
    long countByFollowingId(Long userId);

    // how many users this user follows
    long countByFollowerId(Long userId);

    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);
}


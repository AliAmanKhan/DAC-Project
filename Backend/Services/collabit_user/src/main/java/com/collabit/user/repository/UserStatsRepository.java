package com.collabit.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabit.user.entity.UserStats;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, Long> {
}


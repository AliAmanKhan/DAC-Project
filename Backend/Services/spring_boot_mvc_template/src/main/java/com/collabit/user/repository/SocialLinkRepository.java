package com.collabit.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.collabit.user.entity.SocialLink;

@Repository
public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
    List<SocialLink> findByUserId(Long userId);
    @Modifying
    void deleteByUserId(Long userId);

}


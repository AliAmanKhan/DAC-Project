package com.collabit.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.collabit.user.entity.Education;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByUserId(Long userId);
    @Modifying
    void deleteByUserId(Long userId);

}

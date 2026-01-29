package com.collabit.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_stats")
@Getter @Setter
public class UserStats {

    @Id
    private Long userId;

    private Integer totalCredits;
    private Integer totalProjects;
}

package com.collabit.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import lombok.Builder;

@Entity
@Table(name = "education")
@Getter @Setter
@Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String institute;
    private String degree;
    private String field;
    private Integer startYear;
    private Integer endYear;
    private String description;
}

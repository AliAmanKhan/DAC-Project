package com.collabit.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EducationRequest {
    private String institute;
    private String degree;
    private String field;
    private Integer startYear;
    private Integer endYear;
    private String description;
}

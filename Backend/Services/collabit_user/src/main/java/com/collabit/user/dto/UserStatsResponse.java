package com.collabit.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserStatsResponse {
    private Integer credits;
    private Long followers;
    private Long following;
    private Integer projects;
}

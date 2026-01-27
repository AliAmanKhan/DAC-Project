package com.collabit.user.dto;

import com.collabit.user.enums.SocialPlatform;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialLinkRequest {
    private SocialPlatform platform;
    private String url;
}

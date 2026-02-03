package com.collaboration.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Expected response from User Service
 * Adjust based on your actual User Service API response
 */
@Getter
@Setter
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    // Add other fields as needed
}

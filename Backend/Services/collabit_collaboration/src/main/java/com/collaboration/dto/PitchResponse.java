package com.collaboration.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Expected response from Pitch Service
 * Adjust based on your actual Pitch Service API response
 */
@Getter
@Setter
public class PitchResponse {
    private Long id;
    private String title;
    private Long ownerId;
    private String description;
    // Add other fields as needed
}

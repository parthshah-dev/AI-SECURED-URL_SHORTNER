package com.example.urlshortner.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Response payload representing details of a short URL.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrlResponse {
    private Long id;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private LocalDateTime expiryDate;
    @com.fasterxml.jackson.annotation.JsonProperty("isActive")
    private boolean isActive;
    private String title;
    private String description;
    private int clickCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

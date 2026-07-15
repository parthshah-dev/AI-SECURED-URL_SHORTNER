package com.example.urlshortner.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Request payload for creating a short URL.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUrlRequest {

    @NotBlank(message = "Original URL is required")
    @Pattern(regexp = "^https?://\\S+$", message = "Must be a valid HTTP or HTTPS URL")
    private String originalUrl;

    @Size(max = 30, message = "Alias cannot exceed 30 characters")
    @Pattern(regexp = "^$|^[a-zA-Z0-9_-]{3,30}$", message = "Alias must be between 3 and 30 characters and contain only alphanumeric characters, hyphens, or underscores")
    private String customAlias;

    @Future(message = "Expiry date must be in the future")
    private LocalDateTime expiryDate;
}

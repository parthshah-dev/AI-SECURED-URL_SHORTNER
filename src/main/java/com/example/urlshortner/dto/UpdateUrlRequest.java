package com.example.urlshortner.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Request payload for updating a URL entry.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUrlRequest {

    @NotBlank(message = "Original URL is required")
    @Pattern(regexp = "^https?://\\S+$", message = "Must be a valid HTTP or HTTPS URL")
    private String originalUrl;

    @Future(message = "Expiry date must be in the future")
    private LocalDateTime expiryDate;

    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
}

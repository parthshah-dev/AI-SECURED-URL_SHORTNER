package com.example.urlshortner.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;


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
    @JsonProperty("isActive")
    private boolean isActive;
    private String title;
    private String description;
    private int clickCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String qrCodeUrl;
}

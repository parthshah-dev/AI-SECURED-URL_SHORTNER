package com.example.urlshortner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponse {
    private Long urlId;
    private String shortCode;
    private String originalUrl;
    private int totalClicks;
    private long todayClicks;
}

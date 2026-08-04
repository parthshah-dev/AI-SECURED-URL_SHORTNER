package com.example.urlshortner.controller;

import com.example.urlshortner.dto.AnalyticsResponse;
import com.example.urlshortner.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "URL Analytics", description = "APIs for retrieving URL access logs, click statistics, and usage dashboard")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/{urlId}")
    @Operation(summary = "Get single URL analytics", description = "Retrieves click statistics (total and today's clicks) for a specific URL owned by the user.")
    public ResponseEntity<AnalyticsResponse> getUrlAnalytics(@PathVariable Long urlId) {
        AnalyticsResponse response = analyticsService.getUrlAnalytics(urlId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get dashboard analytics", description = "Retrieves paginated analytics representing total and today's clicks for all URLs owned by the user.")
    public ResponseEntity<Page<AnalyticsResponse>> getDashboardAnalytics(@ParameterObject Pageable pageable) {
        Page<AnalyticsResponse> response = analyticsService.getDashboardAnalytics(pageable);
        return ResponseEntity.ok(response);
    }
}

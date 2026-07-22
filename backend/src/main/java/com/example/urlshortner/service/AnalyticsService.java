package com.example.urlshortner.service;

import com.example.urlshortner.dto.AnalyticsResponse;
import com.example.urlshortner.entity.Url;
import com.example.urlshortner.entity.User;
import com.example.urlshortner.exception.UrlNotFoundException;
import com.example.urlshortner.exception.UnauthorizedURLException;
import com.example.urlshortner.exception.UserNotFoundException;
import com.example.urlshortner.repository.UrlClickRepository;
import com.example.urlshortner.repository.UrlRepository;
import com.example.urlshortner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AnalyticsService {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;
    private final UrlClickRepository urlClickRepository;

    public AnalyticsResponse getUrlAnalytics(Long urlId) {
        log.info("Requesting analytics for URL ID: {}", urlId);
        User currentUser = getAuthenticatedUser();
        Url url = urlRepository.findById(urlId)
                .orElseThrow(() -> new UrlNotFoundException("URL record not found with ID: " + urlId));

        validateOwnership(url, currentUser);

        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        long todayClicks = urlClickRepository.countTodayClicks(url, startOfDay);

        log.info("Analytics retrieved for URL ID: {}", urlId);
        return AnalyticsResponse.builder()
                .urlId(url.getId())
                .shortCode(url.getShortCode())
                .originalUrl(url.getOriginalUrl())
                .totalClicks(url.getClickCount())
                .todayClicks(todayClicks)
                .build();
    }

    public Page<AnalyticsResponse> getDashboardAnalytics(Pageable pageable) {
        log.info("Requesting dashboard analytics page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        User currentUser = getAuthenticatedUser();
        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();

        Page<AnalyticsResponse> response = urlRepository.findAnalyticsByUser(currentUser, startOfDay, pageable);
        log.info("Dashboard analytics retrieved successfully for user {}", currentUser.getEmail());
        return response;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UnauthorizedURLException("No authenticated user found in security context");
        }
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    private void validateOwnership(Url url, User currentUser) {
        if (!url.getUser().getId().equals(currentUser.getId())) {
            log.warn("Unauthorized analytics access attempt by user {} for URL owned by user ID {}",
                    currentUser.getEmail(), url.getUser().getId());
            throw new UnauthorizedURLException("You are not authorized to access analytics for this URL record");
        }
    }
}

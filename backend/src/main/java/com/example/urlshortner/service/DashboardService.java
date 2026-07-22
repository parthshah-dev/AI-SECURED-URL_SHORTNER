package com.example.urlshortner.service;

import com.example.urlshortner.dto.DashboardResponse;
import com.example.urlshortner.entity.User;
import com.example.urlshortner.exception.UnauthorizedURLException;
import com.example.urlshortner.exception.UserNotFoundException;
import com.example.urlshortner.repository.UrlRepository;
import com.example.urlshortner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardService {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboard() {
        log.info("Dashboard requested for user");
        User currentUser = getAuthenticatedUser();
        LocalDateTime now = LocalDateTime.now();

        long totalUrls = urlRepository.countByUser(currentUser);
        long activeUrls = urlRepository.countActiveUrls(currentUser, now);
        long expiredUrls = urlRepository.countExpiredUrls(currentUser, now);

        log.info("Dashboard loaded successfully for user {}", currentUser.getEmail());
        return DashboardResponse.builder()
                .totalUrls(totalUrls)
                .activeUrls(activeUrls)
                .expiredUrls(expiredUrls)
                .build();
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
}

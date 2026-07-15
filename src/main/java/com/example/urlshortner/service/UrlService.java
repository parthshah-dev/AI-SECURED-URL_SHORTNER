package com.example.urlshortner.service;

import com.example.urlshortner.dto.CreateUrlRequest;
import com.example.urlshortner.dto.UpdateUrlRequest;
import com.example.urlshortner.dto.UrlResponse;
import com.example.urlshortner.entity.Url;
import com.example.urlshortner.entity.User;
import com.example.urlshortner.exception.*;
import com.example.urlshortner.repository.UrlRepository;
import com.example.urlshortner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * Service to manage URL shortener operations: creation, updates, deletion, activation, listing, and searching.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UrlService {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;
    private final ShortCodeGenerator shortCodeGenerator;
    private final StringRedisTemplate redisTemplate;

    @Value("${app.short-url-base:http://localhost:8080}")
    private String shortUrlBase;

    /**
     * Create a new short URL or custom alias for the currently authenticated user.
     *
     * @param request the create request details
     * @return the created URL response
     */
    public UrlResponse createUrl(CreateUrlRequest request) {
        User currentUser = getAuthenticatedUser();
        String shortCode;
        String customAlias = null;

        if (request.getCustomAlias() != null && !request.getCustomAlias().trim().isEmpty()) {
            String alias = request.getCustomAlias().trim();
            // Check uniqueness of the custom alias
            if (urlRepository.existsByShortCode(alias) || urlRepository.existsByCustomAlias(alias)) {
                throw new AliasAlreadyExistsException("Custom alias '" + alias + "' already exists");
            }
            shortCode = alias;
            customAlias = alias;
        } else {
            shortCode = generateUniqueShortCode();
        }

        Url url = Url.builder()
                .originalUrl(request.getOriginalUrl())
                .shortCode(shortCode)
                .customAlias(customAlias)
                .expiryDate(request.getExpiryDate())
                .user(currentUser)
                .build();

        Url savedUrl = urlRepository.save(url);
        log.info("Created short URL with code {} for user {}", shortCode, currentUser.getEmail());
        return mapToResponse(savedUrl);
    }

    /**
     * Update an existing short URL's details. Only the owner may update.
     *
     * @param id      the ID of the URL record
     * @param request the update details
     * @return the updated URL response
     */
    public UrlResponse updateUrl(Long id, UpdateUrlRequest request) {
        User currentUser = getAuthenticatedUser();
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new UrlNotFoundException("URL record not found with ID: " + id));

        validateOwnership(url, currentUser);

        url.setOriginalUrl(request.getOriginalUrl());
        url.setExpiryDate(request.getExpiryDate());
        url.setTitle(request.getTitle());
        url.setDescription(request.getDescription());

        Url updatedUrl = urlRepository.save(url);
        try {
            redisTemplate.delete("url:" + url.getShortCode());
            log.info("Invalidated Redis cache for key: url:{}", url.getShortCode());
        } catch (Exception e) {
            log.warn("Failed to delete cache key: {}", url.getShortCode(), e);
        }
        log.info("Updated URL with ID {} by user {}", id, currentUser.getEmail());
        return mapToResponse(updatedUrl);
    }

    /**
     * Delete a URL record permanently. Only the owner may delete.
     *
     * @param id the ID of the URL record
     */
    public void deleteUrl(Long id) {
        User currentUser = getAuthenticatedUser();
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new UrlNotFoundException("URL record not found with ID: " + id));

        validateOwnership(url, currentUser);

        urlRepository.delete(url);
        try {
            redisTemplate.delete("url:" + url.getShortCode());
            log.info("Invalidated Redis cache for key: url:{}", url.getShortCode());
        } catch (Exception e) {
            log.warn("Failed to delete cache key: {}", url.getShortCode(), e);
        }
        log.info("Deleted URL with ID {} by user {}", id, currentUser.getEmail());
    }

    /**
     * Activate a URL record. Only the owner may activate.
     *
     * @param id the ID of the URL record
     * @return the updated URL response
     */
    public UrlResponse activateUrl(Long id) {
        User currentUser = getAuthenticatedUser();
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new UrlNotFoundException("URL record not found with ID: " + id));

        validateOwnership(url, currentUser);

        url.setActive(true);
        Url updatedUrl = urlRepository.save(url);
        try {
            redisTemplate.delete("url:" + url.getShortCode());
            log.info("Invalidated Redis cache for key: url:{}", url.getShortCode());
        } catch (Exception e) {
            log.warn("Failed to delete cache key: {}", url.getShortCode(), e);
        }
        log.info("Activated URL with ID {} by user {}", id, currentUser.getEmail());
        return mapToResponse(updatedUrl);
    }

    /**
     * Deactivate a URL record. Only the owner may deactivate.
     *
     * @param id the ID of the URL record
     * @return the updated URL response
     */
    public UrlResponse deactivateUrl(Long id) {
        User currentUser = getAuthenticatedUser();
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new UrlNotFoundException("URL record not found with ID: " + id));

        validateOwnership(url, currentUser);

        url.setActive(false);
        Url updatedUrl = urlRepository.save(url);
        try {
            redisTemplate.delete("url:" + url.getShortCode());
            log.info("Invalidated Redis cache for key: url:{}", url.getShortCode());
        } catch (Exception e) {
            log.warn("Failed to delete cache key: {}", url.getShortCode(), e);
        }
        log.info("Deactivated URL with ID {} by user {}", id, currentUser.getEmail());
        return mapToResponse(updatedUrl);
    }

    /**
     * View all URLs belonging to the authenticated user.
     *
     * @param sort optional sorting rules (defaults to createdAt desc if unsorted)
     * @return a list of URL responses
     */
    @Transactional(readOnly = true)
    public List<UrlResponse> getMyUrls(Sort sort) {
        User currentUser = getAuthenticatedUser();
        List<Url> urls;
        if (sort == null || sort.isUnsorted()) {
            urls = urlRepository.findByUserOrderByCreatedAtDesc(currentUser);
        } else {
            urls = urlRepository.findByUser(currentUser, sort);
        }
        return urls.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Search within the authenticated user's URLs matching originalUrl, shortCode, or customAlias.
     *
     * @param query the search term
     * @return a list of matching URL responses
     */
    @Transactional(readOnly = true)
    public List<UrlResponse> searchUrls(String query) {
        User currentUser = getAuthenticatedUser();
        List<Url> urls = urlRepository.searchUserUrls(currentUser, query != null ? query.trim() : "");
        return urls.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Generates a unique Base62 short code. Retries if a collision occurs.
     */
    private String generateUniqueShortCode() {
        int retries = 0;
        int maxRetries = 10;
        int length = 6;
        while (retries < maxRetries) {
            String code = shortCodeGenerator.generate(length);
            if (!urlRepository.existsByShortCode(code) && !urlRepository.existsByCustomAlias(code)) {
                return code;
            }
            retries++;
        }
        throw new RuntimeException("Failed to generate a unique short code after " + maxRetries + " attempts due to collision");
    }

    /**
     * Validates that the current authenticated user owns the given URL record.
     */
    private void validateOwnership(Url url, User currentUser) {
        if (!url.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedURLException("You are not authorized to manage this URL record");
        }
    }

    /**
     * Resolves the currently authenticated user from SecurityContext.
     */
    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UnauthorizedURLException("No authenticated user found in security context");
        }
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    /**
     * Map Url entity to UrlResponse DTO.
     */
    private UrlResponse mapToResponse(Url url) {
        String base = shortUrlBase.endsWith("/") ? shortUrlBase : shortUrlBase + "/";
        return UrlResponse.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortCode(url.getShortCode())
                .shortUrl(base + url.getShortCode())
                .expiryDate(url.getExpiryDate())
                .isActive(url.isActive())
                .title(url.getTitle())
                .description(url.getDescription())
                .clickCount(url.getClickCount())
                .createdAt(url.getCreatedAt())
                .updatedAt(url.getUpdatedAt())
                .build();
    }

    public String resolveUrl(String shortCode) {
        String cacheKey = "url:" + shortCode;
        String originalUrl = null;
        try {
            originalUrl = redisTemplate.opsForValue().get(cacheKey);
        } catch (Exception e) {
            log.warn("Failed to get cache key from Redis: {}", cacheKey, e);
        }

        if (originalUrl != null) {
            log.info("Redis CACHE HIT for key: {} -> {}", cacheKey, originalUrl);
            log.info("Incrementing click count in DB for shortCode: {}", shortCode);
            urlRepository.incrementClickCount(shortCode);
            return originalUrl;
        }

        log.info("Redis CACHE MISS for key: {}. Fetching from database...", cacheKey);
        Url url = urlRepository.findByShortCode(shortCode)
                .or(() -> urlRepository.findByCustomAlias(shortCode))
                .orElseThrow(() -> new UrlNotFoundException("URL record not found for code: " + shortCode));

        if (url.getOriginalUrl() == null || url.getOriginalUrl().trim().isEmpty()) {
            throw new InvalidURLException("Original URL is empty");
        }

        if (!url.isActive()) {
            throw new InactiveUrlException("URL is inactive");
        }

        if (url.getExpiryDate() != null) {
            if (url.getExpiryDate().isBefore(LocalDateTime.now())) {
                throw new ExpiredURLException("URL has expired");
            }
        }

        long ttlMinutes = 30;
        if (url.getExpiryDate() != null) {
            long minutesToExpiry = Duration.between(LocalDateTime.now(), url.getExpiryDate()).toMinutes();
            if (minutesToExpiry <= 0) {
                throw new ExpiredURLException("URL has expired");
            }
            ttlMinutes = Math.min(30, minutesToExpiry);
        }

        try {
            redisTemplate.opsForValue().set(cacheKey, url.getOriginalUrl(), ttlMinutes, TimeUnit.MINUTES);
            log.info("Saved URL to Redis: {} -> {} with TTL of {} minutes", cacheKey, url.getOriginalUrl(), ttlMinutes);
        } catch (Exception e) {
            log.warn("Failed to save cache key to Redis: {}", cacheKey, e);
        }

        log.info("Incrementing click count in DB for shortCode: {}", shortCode);
        urlRepository.incrementClickCount(shortCode);

        return url.getOriginalUrl();
    }
}

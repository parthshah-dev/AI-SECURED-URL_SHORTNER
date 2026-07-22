package com.example.urlshortner.service;

import com.example.urlshortner.dto.CreateUrlRequest;
import com.example.urlshortner.dto.UpdateUrlRequest;
import com.example.urlshortner.dto.UrlResponse;
import com.example.urlshortner.dto.UrlSafetyCheckResponse;
import com.example.urlshortner.entity.Url;
import com.example.urlshortner.entity.UrlClick;
import com.example.urlshortner.entity.User;
import com.example.urlshortner.exception.*;
import com.example.urlshortner.repository.UrlRepository;
import com.example.urlshortner.repository.UrlClickRepository;
import com.example.urlshortner.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
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


@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UrlService {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;
    private final ShortCodeGenerator shortCodeGenerator;
    private final StringRedisTemplate redisTemplate;
    private final GeminiApiService geminiApiService;
    private final UrlClickRepository urlClickRepository;

    @Value("${app.short-url-base:http://localhost:8080}")
    private String shortUrlBase;

    
    public UrlResponse createUrl(CreateUrlRequest request) {
        User currentUser = getAuthenticatedUser();

        UrlSafetyCheckResponse safety = geminiApiService.checkUrlSafety(request.getOriginalUrl());
        if (!safety.isSafe()) {
            throw new InvalidURLException("URL safety check failed: " + safety.getReason());
        }

        String shortCode;
        String customAlias = null;

        if (request.getCustomAlias() != null && !request.getCustomAlias().trim().isEmpty()) {
            String alias = request.getCustomAlias().trim();
            
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

    
    @Transactional(readOnly = true)
    public List<UrlResponse> searchUrls(String query) {
        User currentUser = getAuthenticatedUser();
        List<Url> urls = urlRepository.searchUserUrls(currentUser, query != null ? query.trim() : "");
        return urls.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    
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

    
    private void validateOwnership(Url url, User currentUser) {
        if (!url.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedURLException("You are not authorized to manage this URL record");
        }
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
                .qrCodeUrl(base + "api/qr/" + url.getShortCode())
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
            Url url = urlRepository.findByShortCode(shortCode)
                    .or(() -> urlRepository.findByCustomAlias(shortCode))
                    .orElse(null);
            if (url != null) {
                recordClick(url);
            }
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

        recordClick(url);

        return url.getOriginalUrl();
    }

    private void recordClick(Url url) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes != null ? attributes.getRequest() : null;

        String ipAddress = request != null ? request.getRemoteAddr() : null;
        LocalDateTime now = LocalDateTime.now();

        urlRepository.incrementClickCount(url.getShortCode(), now);

        UrlClick click = UrlClick.builder()
                .url(url)
                .clickedAt(now)
                .ipAddress(ipAddress)
                .build();
        urlClickRepository.save(click);
    }
}

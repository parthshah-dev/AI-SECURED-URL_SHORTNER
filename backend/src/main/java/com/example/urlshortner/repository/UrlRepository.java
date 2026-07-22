package com.example.urlshortner.repository;

import com.example.urlshortner.entity.Url;
import com.example.urlshortner.entity.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {

    
    Optional<Url> findByShortCode(String shortCode);

    
    Optional<Url> findByCustomAlias(String customAlias);

    
    boolean existsByShortCode(String shortCode);

    
    boolean existsByCustomAlias(String customAlias);

    
    List<Url> findByUserOrderByCreatedAtDesc(User user);

    
    List<Url> findByUser(User user, Sort sort);

    
    @Query("SELECT u FROM Url u WHERE u.user = :user AND (" +
           "LOWER(u.originalUrl) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.shortCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.customAlias) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY u.createdAt DESC")
    List<Url> searchUserUrls(@Param("user") User user, @Param("query") String query);

    
    @Modifying
    @Query("UPDATE Url u SET u.clickCount = u.clickCount + 1, u.lastAccessTime = :lastAccessTime WHERE u.shortCode = :shortCode OR u.customAlias = :shortCode")
    int incrementClickCount(@Param("shortCode") String shortCode, @Param("lastAccessTime") java.time.LocalDateTime lastAccessTime);

    @Query("SELECT new com.example.urlshortner.dto.AnalyticsResponse(" +
           "u.id, u.shortCode, u.originalUrl, u.clickCount, " +
           "(SELECT COUNT(c) FROM UrlClick c WHERE c.url = u AND c.clickedAt >= :startOfDay)) " +
           "FROM Url u WHERE u.user = :user")
    org.springframework.data.domain.Page<com.example.urlshortner.dto.AnalyticsResponse> findAnalyticsByUser(
            @Param("user") User user,
            @Param("startOfDay") java.time.LocalDateTime startOfDay,
            org.springframework.data.domain.Pageable pageable);

    long countByUser(User user);

    @Query("SELECT COUNT(u) FROM Url u WHERE u.user = :user AND u.isActive = true AND (u.expiryDate IS NULL OR u.expiryDate >= :now)")
    long countActiveUrls(@Param("user") User user, @Param("now") java.time.LocalDateTime now);

    @Query("SELECT COUNT(u) FROM Url u WHERE u.user = :user AND u.expiryDate IS NOT NULL AND u.expiryDate < :now")
    long countExpiredUrls(@Param("user") User user, @Param("now") java.time.LocalDateTime now);
}

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

/**
 * Repository interface for managing {@link Url} entities.
 */
@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {

    /**
     * Find a URL by its short code.
     *
     * @param shortCode the short code to search for
     * @return an Optional containing the found URL, or empty
     */
    Optional<Url> findByShortCode(String shortCode);

    /**
     * Find a URL by its custom alias.
     *
     * @param customAlias the custom alias to search for
     * @return an Optional containing the found URL, or empty
     */
    Optional<Url> findByCustomAlias(String customAlias);

    /**
     * Check if a URL exists with the given short code.
     *
     * @param shortCode the short code to check
     * @return true if exists, false otherwise
     */
    boolean existsByShortCode(String shortCode);

    /**
     * Check if a URL exists with the given custom alias.
     *
     * @param customAlias the custom alias to check
     * @return true if exists, false otherwise
     */
    boolean existsByCustomAlias(String customAlias);

    /**
     * Find all URLs belonging to a user, sorted by creation date descending.
     *
     * @param user the owner of the URLs
     * @return the list of URLs
     */
    List<Url> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Find all URLs belonging to a user, sorted by the provided Sort configuration.
     *
     * @param user the owner of the URLs
     * @param sort the sorting criteria
     * @return the list of URLs
     */
    List<Url> findByUser(User user, Sort sort);

    /**
     * Search within a user's URLs matching originalUrl, shortCode, or customAlias.
     * Results are sorted by newest first.
     *
     * @param user  the owner of the URLs
     * @param query the search term
     * @return the matching list of URLs
     */
    @Query("SELECT u FROM Url u WHERE u.user = :user AND (" +
           "LOWER(u.originalUrl) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.shortCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.customAlias) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY u.createdAt DESC")
    List<Url> searchUserUrls(@Param("user") User user, @Param("query") String query);

    /**
     * Increment click count for a short code/custom alias.
     *
     * @param shortCode the short code to increment click count for
     * @return number of updated rows
     */
    @Modifying
    @Query("UPDATE Url u SET u.clickCount = u.clickCount + 1 WHERE u.shortCode = :shortCode")
    int incrementClickCount(@Param("shortCode") String shortCode);
}

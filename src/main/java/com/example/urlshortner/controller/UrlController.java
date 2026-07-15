package com.example.urlshortner.controller;

import com.example.urlshortner.dto.CreateUrlRequest;
import com.example.urlshortner.dto.MessageResponse;
import com.example.urlshortner.dto.UpdateUrlRequest;
import com.example.urlshortner.dto.UrlResponse;
import com.example.urlshortner.service.UrlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller to expose URL shortener management APIs.
 */
@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
@Tag(name = "URL Management", description = "APIs for creating, updating, deleting, and searching short URLs")
public class UrlController {

    private final UrlService urlService;

    /**
     * Create a new short URL.
     *
     * @param request the create request details
     * @return the created URL response
     */
    @PostMapping
    @Operation(summary = "Create short URL", description = "Generates a short URL or custom alias for the authenticated user.")
    public ResponseEntity<UrlResponse> createUrl(@Valid @RequestBody CreateUrlRequest request) {
        UrlResponse response = urlService.createUrl(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update an existing URL record.
     *
     * @param id      the URL ID
     * @param request the update request details
     * @return the updated URL response
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update URL details", description = "Updates original URL, expiry date, title, and description. Only the owner may perform this action.")
    public ResponseEntity<UrlResponse> updateUrl(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUrlRequest request
    ) {
        UrlResponse response = urlService.updateUrl(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a URL record.
     *
     * @param id the URL ID
     * @return message indicating deletion success
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete URL", description = "Permanently deletes a short URL. Only the owner may perform this action.")
    public ResponseEntity<MessageResponse> deleteUrl(@PathVariable Long id) {
        urlService.deleteUrl(id);
        return ResponseEntity.ok(new MessageResponse("URL record deleted successfully"));
    }

    /**
     * Activate a URL.
     *
     * @param id the URL ID
     * @return the updated URL response
     */
    @PatchMapping("/{id}/activate")
    @Operation(summary = "Activate URL", description = "Enables redirection for the short URL. Only the owner may perform this action.")
    public ResponseEntity<UrlResponse> activateUrl(@PathVariable Long id) {
        UrlResponse response = urlService.activateUrl(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Deactivate a URL.
     *
     * @param id the URL ID
     * @return the updated URL response
     */
    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate URL", description = "Disables redirection for the short URL. Only the owner may perform this action.")
    public ResponseEntity<UrlResponse> deactivateUrl(@PathVariable Long id) {
        UrlResponse response = urlService.deactivateUrl(id);
        return ResponseEntity.ok(response);
    }

    /**
     * View all URLs belonging to the authenticated user.
     *
     * @param sort optional sorting criteria (e.g. createdAt,desc)
     * @return list of URL responses
     */
    @GetMapping
    @Operation(summary = "View my URLs", description = "Retrieves all short URLs owned by the currently authenticated user.")
    public ResponseEntity<List<UrlResponse>> getMyUrls(Sort sort) {
        List<UrlResponse> response = urlService.getMyUrls(sort);
        return ResponseEntity.ok(response);
    }

    /**
     * Search URLs owned by the authenticated user.
     *
     * @param query the search query mapping to original URL, short code, or custom alias
     * @return list of matching URL responses
     */
    @GetMapping("/search")
    @Operation(summary = "Search URLs", description = "Search within authenticated user's URLs by original URL, short code, or custom alias. Sorted newest first.")
    public ResponseEntity<List<UrlResponse>> searchUrls(@RequestParam String query) {
        List<UrlResponse> response = urlService.searchUrls(query);
        return ResponseEntity.ok(response);
    }
}

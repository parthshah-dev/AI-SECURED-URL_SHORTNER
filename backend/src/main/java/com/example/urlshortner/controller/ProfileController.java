package com.example.urlshortner.controller;

import com.example.urlshortner.dto.*;
import com.example.urlshortner.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "APIs for user profile management including name updates, email change, and password modification")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    @Operation(summary = "View profile details", description = "Retrieves account details for the currently logged-in user.")
    public ResponseEntity<ProfileResponse> getProfile() {
        ProfileResponse response = profileService.getProfile();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/name")
    @Operation(summary = "Update profile name", description = "Allows the logged-in user to change their name.")
    public ResponseEntity<ProfileResponse> updateName(@Valid @RequestBody UpdateNameRequest request) {
        ProfileResponse response = profileService.updateName(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/email")
    @Operation(summary = "Request email update", description = "Triggers email verification link sent to the new email address. Requires password verification.")
    public ResponseEntity<MessageResponse> requestEmailUpdate(@Valid @RequestBody UpdateEmailRequest request) {
        profileService.requestEmailUpdate(request);
        return ResponseEntity.ok(new MessageResponse("Verification email sent successfully. Please check your new inbox."));
    }

    @GetMapping("/email/verify")
    @Operation(summary = "Verify new email address", description = "Processes the verification link clicked by the user to finalize email change.")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam String token) {
        profileService.verifyEmail(token);
        return ResponseEntity.ok(new MessageResponse("Email verified and updated successfully."));
    }

    @PutMapping("/password")
    @Operation(summary = "Change password", description = "Updates password for the logged-in user. Validates old password and ensures new and confirmation passwords match.")
    public ResponseEntity<MessageResponse> changePassword(@Valid @RequestBody ProfileChangePasswordRequest request) {
        profileService.changePassword(request);
        return ResponseEntity.ok(new MessageResponse("Password updated successfully."));
    }
}

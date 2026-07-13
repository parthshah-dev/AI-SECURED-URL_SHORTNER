package com.example.urlshortner.controller;

import com.example.urlshortner.dto.*;
import com.example.urlshortner.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller to expose authentication and account management endpoints.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and user account management API")
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint to register a new user.
     *
     * @param request the registration details
     * @return MessageResponse indicating that the user needs to check their email
     */
    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Registers a new user and sends an activation email via Brevo.")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Registration successful. Please check your email to activate your account."));
    }

    /**
     * Endpoint to activate a user account using a token.
     *
     * @param token the activation token
     * @return MessageResponse indicating successful activation
     */
    @GetMapping("/activate")
    @Operation(summary = "Activate user account", description = "Activates a user's account by verifying the token.")
    public ResponseEntity<MessageResponse> activate(@RequestParam String token) {
        authService.activate(token);
        return ResponseEntity.ok(new MessageResponse("Account activated successfully. You can now login."));
    }

    /**
     * Endpoint to authenticate a user and retrieve JWT token.
     *
     * @param request the login credentials
     * @return LoginResponse containing the access token
     */
    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates user credentials and returns JWT access token.")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint to change user's password.
     *
     * @param request the change password payload
     * @return MessageResponse indicating password update success
     */
    @PutMapping("/change-password")
    @Operation(summary = "Change password", description = "Changes the password of the currently authenticated user.")
    public ResponseEntity<MessageResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully."));
    }

    /**
     * Endpoint to logout a user.
     *
     * @return MessageResponse indicating logout success
     */
    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Logs out the authenticated user.")
    public ResponseEntity<MessageResponse> logout() {
        authService.logout();
        return ResponseEntity.ok(new MessageResponse("Logout successful."));
    }
}

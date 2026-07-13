package com.example.urlshortner.service;

import com.example.urlshortner.dto.*;
import com.example.urlshortner.entity.User;
import com.example.urlshortner.entity.UserRole;
import com.example.urlshortner.exception.*;
import com.example.urlshortner.repository.UserRepository;
import com.example.urlshortner.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service to handle core authentication operations: registration, activation, login,
 * changing password, and logout.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    /**
     * Registers a new user. The account starts as disabled and unverified.
     *
     * @param request the registration request payload
     */
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email address is already in use: " + request.getEmail());
        }

        String activationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.ROLE_USER)
                .enabled(false)
                .emailVerified(false)
                .activationToken(activationToken)
                .activationTokenExpiry(LocalDateTime.now().plusHours(24))
                .build();

        userRepository.save(user);

        // Dispatches the activation email. If this fails, the transaction rolls back.
        emailService.sendActivationEmail(user.getEmail(), user.getName(), activationToken);
    }

    /**
     * Activates a user account using the activation token.
     *
     * @param token the activation token
     */
    public void activate(String token) {
        User user = userRepository.findByActivationToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid activation token"));

        if (user.getActivationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Activation token has expired");
        }

        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setActivationToken(null);
        user.setActivationTokenExpiry(null);

        userRepository.save(user);
        log.info("User {} activated successfully", user.getEmail());
    }

    /**
     * Authenticates a user and generates a JWT access token valid for 24 hours.
     *
     * @param request the login request payload
     * @return LoginResponse containing the access token
     */
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException("Email address has not been verified yet");
        }

        // Standard Spring Security Authentication
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String accessToken = jwtService.generateToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .build();
    }

    /**
     * Changes password of the currently authenticated user.
     *
     * @param request the password change request containing old and new passwords
     */
    public void changePassword(ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found in context");
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new InvalidTokenException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password updated successfully for user {}", email);
    }

    /**
     * Logs out the currently authenticated user.
     */
    public void logout() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            log.info("User {} logged out successfully", auth.getName());
        }
    }
}

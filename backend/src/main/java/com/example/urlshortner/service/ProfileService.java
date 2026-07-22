package com.example.urlshortner.service;

import com.example.urlshortner.dto.*;
import com.example.urlshortner.entity.User;
import com.example.urlshortner.exception.*;
import com.example.urlshortner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile() {
        log.info("Profile viewed");
        User currentUser = getAuthenticatedUser();
        return mapToResponse(currentUser);
    }

    public ProfileResponse updateName(UpdateNameRequest request) {
        User currentUser = getAuthenticatedUser();
        currentUser.setName(request.getName());
        User savedUser = userRepository.save(currentUser);
        log.info("Name updated");
        return mapToResponse(savedUser);
    }

    public void requestEmailUpdate(UpdateEmailRequest request) {
        User currentUser = getAuthenticatedUser();

        if (!passwordEncoder.matches(request.getPassword(), currentUser.getPassword())) {
            throw new InvalidCurrentPasswordException("Incorrect current password");
        }

        String newEmail = request.getEmail().trim().toLowerCase();
        if (currentUser.getEmail().equalsIgnoreCase(newEmail)) {
            throw new EmailAlreadyExistsException("New email must be different from current email");
        }

        if (userRepository.existsByEmail(newEmail)) {
            throw new EmailAlreadyExistsException("Email address is already in use: " + newEmail);
        }

        String token = UUID.randomUUID().toString();
        currentUser.setPendingEmail(newEmail);
        currentUser.setEmailVerificationToken(token);
        currentUser.setEmailVerificationExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(currentUser);

        emailService.sendEmailUpdateVerificationEmail(newEmail, currentUser.getName(), token);
        log.info("Email verification sent");
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new InvalidVerificationTokenException("Invalid verification token"));

        if (user.getEmailVerificationExpiry().isBefore(LocalDateTime.now())) {
            throw new ExpiredVerificationTokenException("Verification token has expired");
        }

        String newEmail = user.getPendingEmail();
        if (userRepository.existsByEmail(newEmail)) {
            throw new EmailAlreadyExistsException("Email address is already in use: " + newEmail);
        }

        user.setEmail(newEmail);
        user.setPendingEmail(null);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationExpiry(null);
        user.setEmailVerified(true);
        userRepository.save(user);

        log.info("Email updated successfully");
    }

    public void changePassword(ProfileChangePasswordRequest request) {
        User currentUser = getAuthenticatedUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new InvalidCurrentPasswordException("Incorrect current password");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new InvalidCurrentPasswordException("New password and confirmation password do not match");
        }

        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
        log.info("Password changed successfully");
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

    private ProfileResponse mapToResponse(User user) {
        return ProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .emailVerified(user.isEmailVerified())
                .build();
    }
}

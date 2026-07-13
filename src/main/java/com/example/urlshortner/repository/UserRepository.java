package com.example.urlshortner.repository;

import com.example.urlshortner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for managing {@link User} entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address.
     *
     * @param email the email to search for
     * @return an Optional containing the found user, or empty
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a user exists with the given email address.
     *
     * @param email the email to check
     * @return true if exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Find a user by their account activation token.
     *
     * @param activationToken the token to search for
     * @return an Optional containing the found user, or empty
     */
    Optional<User> findByActivationToken(String activationToken);
}

package com.example.urlshortner.repository;

import com.example.urlshortner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    
    Optional<User> findByEmail(String email);

    
    boolean existsByEmail(String email);

    
    Optional<User> findByActivationToken(String activationToken);

    Optional<User> findByEmailVerificationToken(String emailVerificationToken);
}

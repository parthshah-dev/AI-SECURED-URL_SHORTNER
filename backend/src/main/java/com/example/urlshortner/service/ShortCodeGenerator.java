package com.example.urlshortner.service;

import org.springframework.stereotype.Service;
import java.security.SecureRandom;


@Service
public class ShortCodeGenerator {

    private static final String BASE62_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private final SecureRandom random = new SecureRandom();

    
    public String generate(int length) {
        if (length <= 0) {
            throw new IllegalArgumentException("Length must be greater than zero");
        }
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(BASE62_CHARACTERS.length());
            sb.append(BASE62_CHARACTERS.charAt(randomIndex));
        }
        return sb.toString();
    }
}

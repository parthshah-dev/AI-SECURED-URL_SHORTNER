package com.example.urlshortner.dto;

import lombok.*;

/**
 * Response payload containing the JWT token upon successful login.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String accessToken;

    @Builder.Default
    private String tokenType = "Bearer";
}

package com.example.urlshortner.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateEmailRequest {

    @NotBlank(message = "New email is required")
    @Email(message = "Email format is invalid")
    private String email;

    @NotBlank(message = "Current password is required")
    private String password;
}

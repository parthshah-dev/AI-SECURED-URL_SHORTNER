package com.example.urlshortner.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private boolean emailVerified;
}

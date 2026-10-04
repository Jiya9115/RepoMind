package com.repomind.dto;

import java.time.Instant;

public class AuthDto {

    public record LoginRequest(String email, String password) {}

    public record RegisterRequest(String name, String email, String password) {}

    public record UserDto(Long id, String name, String email, String githubId, Instant createdAt) {}

    public record AuthResponse(String accessToken, String tokenType, UserDto user) {
        public AuthResponse(String accessToken, UserDto user) {
            this(accessToken, "Bearer", user);
        }
    }
}

package com.demoshop.controller;

import com.demoshop.model.User;
import com.demoshop.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    // Intentional finding for RepoMind Security Scanner: Fallback hardcoded secret
    private String JWT_SECRET = "super-secret-demo-key-1234567890";

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    public record LoginRequest(String username, String password) {}
    public record RegisterRequest(String name, String email, String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.findUserByEmail(request.username())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }

        return ResponseEntity.ok(Map.of(
                "access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demoshop.fake.token",
                "token_type", "bearer",
                "user", Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail())
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(request.name(), request.email(), "hashed_" + request.password());
        return ResponseEntity.ok(Map.of(
                "access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demoshop.fake.token",
                "token_type", "bearer",
                "user", Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail())
        ));
    }
}

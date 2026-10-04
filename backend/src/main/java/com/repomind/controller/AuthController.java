package com.repomind.controller;

import com.repomind.dto.AuthDto.*;
import com.repomind.security.SecurityUtils;
import com.repomind.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Value("${repomind.github.client-id:}")
    private String githubClientId;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/demo-token")
    public ResponseEntity<AuthResponse> getDemoToken() {
        return ResponseEntity.ok(userService.getOrCreateDemoUser());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String email = SecurityUtils.getCurrentUserEmail().orElse(null);
        if (email == null) {
            return ResponseEntity.ok(userService.getOrCreateDemoUser().user());
        }
        return ResponseEntity.ok(Map.of("email", email));
    }

    @GetMapping("/github")
    public ResponseEntity<Map<String, Object>> getGithubStatus() {
        boolean configured = githubClientId != null && !githubClientId.isBlank();
        return ResponseEntity.ok(Map.of(
                "configured", configured,
                "clientId", configured ? githubClientId : "",
                "message", configured ? "GitHub OAuth active" : "GitHub OAuth not configured. Local authentication and Demo Mode are fully enabled."
        ));
    }
}

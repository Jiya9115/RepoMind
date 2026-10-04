package com.repomind.service;

import com.repomind.dto.AuthDto.*;
import com.repomind.exception.BadRequestException;
import com.repomind.model.User;
import com.repomind.repository.UserRepository;
import com.repomind.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        User user = new User(
                request.name(),
                request.email(),
                passwordEncoder.encode(request.password())
        );
        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getGithubId(), user.getCreatedAt());

        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("Invalid email or password credentials."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password credentials.");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getGithubId(), user.getCreatedAt());

        return new AuthResponse(token, userDto);
    }

    @Transactional
    public AuthResponse getOrCreateDemoUser() {
        User demo = userRepository.findByEmail("demo@repomind.io").orElseGet(() -> {
            User newUser = new User("Demo Recruiter", "demo@repomind.io", passwordEncoder.encode("demopassword123"));
            newUser.setGithubId("demo-recruiter");
            return userRepository.save(newUser);
        });

        String token = tokenProvider.generateToken(demo.getEmail(), demo.getId());
        UserDto userDto = new UserDto(demo.getId(), demo.getName(), demo.getEmail(), demo.getGithubId(), demo.getCreatedAt());

        return new AuthResponse(token, userDto);
    }
}

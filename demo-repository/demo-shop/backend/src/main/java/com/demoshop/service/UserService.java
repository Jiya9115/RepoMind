package com.demoshop.service;

import com.demoshop.model.User;
import com.demoshop.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerUser(String name, String email, String passwordHash) {
        User user = new User(email, name, passwordHash);
        return userRepository.save(user);
    }
}

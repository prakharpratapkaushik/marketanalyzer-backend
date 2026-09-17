package com.marketanalyzer.service;

import com.marketanalyzer.model.dto.AuthRequestDto;
import com.marketanalyzer.model.dto.RegisterRequestDto;
import com.marketanalyzer.model.entity.UserEntity;
import com.marketanalyzer.model.entity.UserSessionEntity;
import com.marketanalyzer.repository.UserRepository;
import com.marketanalyzer.repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;

    @Value("${app.auth.demo-email}") private String demoEmail;
    @Value("${app.auth.demo-password}") private String demoPassword;

    public AuthService(UserRepository userRepository, UserSessionRepository userSessionRepository) {
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
    }

    @PostConstruct
    void addDemoUser() {
        String email = normalize(demoEmail);
        if (!userRepository.existsById(email)) {
            userRepository.save(new UserEntity("Demo", "User", email, hash(demoPassword)));
        }
    }

    public Map<String, Object> login(AuthRequestDto request) {
        UserEntity user = userRepository.findById(normalize(request.getEmail())).orElse(null);
        if (user == null || !user.getPasswordHash().equals(hash(request.getPassword()))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        return createSession(user);
    }

    public Map<String, Object> register(RegisterRequestDto request) {
        String email = normalize(request.getEmail());
        if (userRepository.existsById(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account already exists for this email");
        }
        UserEntity user = userRepository.save(new UserEntity(
                request.getFirstName().trim(), request.getLastName().trim(), email, hash(request.getPassword())));
        return createSession(user);
    }

    public String requireUserEmail(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication token is required");
        }
        UserSessionEntity session = userSessionRepository.findById(authorization.substring(7)).orElse(null);
        if (session == null || session.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session is invalid or expired");
        }
        return session.getUserEmail();
    }

    private Map<String, Object> createSession(UserEntity user) {
        String token = UUID.randomUUID() + "." + UUID.randomUUID();
        userSessionRepository.save(new UserSessionEntity(token, user.getEmail(), Instant.now().plusSeconds(86_400)));
        return Map.of("token", token, "refreshToken", token, "user", Map.of(
                "firstName", user.getFirstName(), "lastName", user.getLastName(), "email", user.getEmail()));
    }

    private String normalize(String email) { return email.trim().toLowerCase(); }
    private String hash(String value) {
        try {
            byte[] bytes = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(bytes);
        } catch (NoSuchAlgorithmException exception) { throw new IllegalStateException(exception); }
    }

}

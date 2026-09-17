package com.marketanalyzer.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "user_sessions")
public class UserSessionEntity {
    @Id
    @Column(nullable = false, updatable = false, length = 100)
    private String token;

    @Column(name = "user_email", nullable = false, length = 254)
    private String userEmail;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected UserSessionEntity() {
    }

    public UserSessionEntity(String token, String userEmail, Instant expiresAt) {
        this.token = token;
        this.userEmail = userEmail;
        this.expiresAt = expiresAt;
        this.createdAt = Instant.now();
    }

    public String getUserEmail() { return userEmail; }
    public Instant getExpiresAt() { return expiresAt; }
}

package com.marketanalyzer.repository;

import com.marketanalyzer.model.entity.UserSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSessionRepository extends JpaRepository<UserSessionEntity, String> {
}

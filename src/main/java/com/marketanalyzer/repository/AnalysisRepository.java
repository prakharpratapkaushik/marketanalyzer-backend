package com.marketanalyzer.repository;

import com.marketanalyzer.model.entity.AnalysisEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AnalysisRepository extends JpaRepository<AnalysisEntity, UUID> {
    Optional<AnalysisEntity> findByIdAndUserEmail(UUID id, String userEmail);
    List<AnalysisEntity> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}

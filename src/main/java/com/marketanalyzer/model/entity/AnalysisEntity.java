package com.marketanalyzer.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "analyses")
public class AnalysisEntity {
    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "user_email", nullable = false, length = 254)
    private String userEmail;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(name = "business_type", nullable = false, length = 100)
    private String businessType;

    @Column(nullable = false, length = 500)
    private String location;

    @Column(nullable = false)
    private Double radius;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "analysis_result", nullable = false, columnDefinition = "json")
    private Map<String, Object> analysisResult;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected AnalysisEntity() {
    }

    public AnalysisEntity(String userEmail, String businessName, String businessType, String location,
                          Double radius, Map<String, Object> analysisResult) {
        this.id = UUID.randomUUID();
        this.userEmail = userEmail;
        this.businessName = businessName;
        this.businessType = businessType;
        this.location = location;
        this.radius = radius;
        this.analysisResult = analysisResult;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getBusinessName() { return businessName; }
    public String getBusinessType() { return businessType; }
    public String getLocation() { return location; }
    public Double getRadius() { return radius; }
    public Map<String, Object> getAnalysisResult() { return analysisResult; }
}

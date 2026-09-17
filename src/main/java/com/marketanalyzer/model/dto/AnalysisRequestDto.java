package com.marketanalyzer.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AnalysisRequestDto {
    @NotBlank
    private String businessName;
    @NotBlank
    private String businessType;
    @NotBlank
    private String location;
    @Positive
    private Double radius = 5.0;
    private Integer competitorCount;
    private Double budget;
    private String competitionLevel;
    private String additionalInfo;
    private String priceRange = "medium";
    private String targetAudience = "general";
}

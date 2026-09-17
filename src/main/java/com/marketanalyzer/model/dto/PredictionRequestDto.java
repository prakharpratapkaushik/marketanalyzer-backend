package com.marketanalyzer.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PredictionRequestDto {

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Business type is required")
    private String businessType;

    private String priceRange = "medium";

    private String targetAudience = "general";

    @Positive(message = "Radius must be positive")
    private Double radius = 5.0;

    private Double latitude;
    private Double longitude;
}
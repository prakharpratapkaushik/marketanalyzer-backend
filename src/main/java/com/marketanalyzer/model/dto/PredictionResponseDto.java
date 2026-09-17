package com.marketanalyzer.model.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class PredictionResponseDto {
    private double successProbability;
    private double demandScore;
    private double competitionScore;
    private double affordabilityScore;
    private double finalScore;
    private List<String> insights;
    private int competitorCount;
    private List<Map<String, Object>> competitors;
}
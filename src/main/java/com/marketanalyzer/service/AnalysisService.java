package com.marketanalyzer.service;

import com.marketanalyzer.model.dto.AnalysisRequestDto;
import com.marketanalyzer.model.dto.PredictionRequestDto;
import com.marketanalyzer.model.dto.PredictionResponseDto;
import com.marketanalyzer.model.entity.AnalysisEntity;
import com.marketanalyzer.repository.AnalysisRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AnalysisService {
    private final PredictionService predictionService;
    private final AnalysisRepository analysisRepository;

    public AnalysisService(PredictionService predictionService, AnalysisRepository analysisRepository) {
        this.predictionService = predictionService;
        this.analysisRepository = analysisRepository;
    }

    public Map<String, Object> create(String userEmail, AnalysisRequestDto request) {
        PredictionRequestDto predictionRequest = new PredictionRequestDto();
        predictionRequest.setLocation(request.getLocation());
        predictionRequest.setBusinessType(request.getBusinessType());
        predictionRequest.setRadius(request.getRadius());
        predictionRequest.setPriceRange(request.getPriceRange());
        predictionRequest.setTargetAudience(request.getTargetAudience());
        PredictionResponseDto prediction = predictionService.predict(predictionRequest);

        List<Map<String, Object>> competitors = createCompetitors(request);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("successProbability", prediction.getSuccessProbability());
        result.put("demandScore", prediction.getDemandScore());
        result.put("competitionScore", prediction.getCompetitionScore());
        result.put("affordabilityScore", prediction.getAffordabilityScore());
        result.put("finalScore", prediction.getFinalScore());
        result.put("insights", prediction.getInsights());
        result.put("competitorCount", competitors.size());
        result.put("competitors", competitors);
        result.put("model", "heuristic-v1");

        AnalysisEntity analysis = analysisRepository.save(new AnalysisEntity(
                userEmail, request.getBusinessName(), request.getBusinessType(), request.getLocation(),
                request.getRadius(), result));
        return toResponse(analysis);
    }

    public Map<String, Object> get(String userEmail, String id) {
        AnalysisEntity analysis;
        try {
            analysis = analysisRepository.findByIdAndUserEmail(UUID.fromString(id), userEmail).orElse(null);
        } catch (IllegalArgumentException exception) {
            analysis = null;
        }
        if (analysis == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Analysis not found");
        }
        return toResponse(analysis);
    }

    public List<Map<String, Object>> list(String userEmail) {
        return analysisRepository.findByUserEmailOrderByCreatedAtDesc(userEmail).stream().map(this::toResponse).toList();
    }

    private Map<String, Object> toResponse(AnalysisEntity analysis) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", analysis.getId().toString());
        response.put("status", "COMPLETED");
        response.put("businessName", analysis.getBusinessName());
        response.put("businessType", analysis.getBusinessType());
        response.put("location", analysis.getLocation());
        response.put("searchRadius", analysis.getRadius());
        response.put("analysisResult", analysis.getAnalysisResult());
        response.putAll(analysis.getAnalysisResult());
        return response;
    }

    private List<Map<String, Object>> createCompetitors(AnalysisRequestDto request) {
        int requested = request.getCompetitorCount() == null ? 5 : request.getCompetitorCount();
        int count = Math.max(0, Math.min(requested, 20));
        List<Map<String, Object>> result = new ArrayList<>();
        String label = request.getBusinessType().replace('_', ' ');
        for (int i = 1; i <= count; i++) {
            double rating = Math.round((3.5 + ((Math.abs((request.getLocation() + i).hashCode()) % 15) / 10.0)) * 10.0) / 10.0;
            result.add(Map.of("id", "competitor-" + i, "name", label + " competitor " + i,
                    "rating", Math.min(rating, 5.0), "reviews", 20 + i * 17,
                    "distanceKm", Math.round((i * 0.4) * 10.0) / 10.0, "location", request.getLocation()));
        }
        return result;
    }
}

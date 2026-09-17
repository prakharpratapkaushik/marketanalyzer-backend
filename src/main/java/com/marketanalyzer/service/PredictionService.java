package com.marketanalyzer.service;

import com.marketanalyzer.ml.ModelLoader;
import com.marketanalyzer.model.dto.PredictionRequestDto;
import com.marketanalyzer.model.dto.PredictionResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PredictionService {

    private final ModelLoader modelLoader;

    public PredictionResponseDto predict(PredictionRequestDto request) {
        log.info("📊 Making prediction for: {} in {}", request.getBusinessType(), request.getLocation());

        // Get location demographics
        Map<String, Double> demographics = getLocationDemographics(request.getLocation());

        // Get competitor data
        Map<String, Object> competitorData = getCompetitorData(request);

        // Build feature vector
        double[] features = buildFeatureVector(request, demographics, competitorData);

        // Make prediction
        double[][] featureArray = new double[][]{features};
        double[] predictions = modelLoader.predict(featureArray);
        double successProbability = predictions[0];

        // Calculate component scores
        double demandScore = calculateDemandScore(demographics, request);
        double competitionScore = calculateCompetitionScore(competitorData);
        double affordabilityScore = calculateAffordabilityScore(demographics, request);

        // Generate insights
        List<String> insights = generateInsights(
                demandScore, competitionScore, affordabilityScore,
                successProbability, competitorData, demographics, request
        );

        return PredictionResponseDto.builder()
                .successProbability(successProbability)
                .demandScore(demandScore)
                .competitionScore(competitionScore)
                .affordabilityScore(affordabilityScore)
                .finalScore(demandScore * 0.5 + competitionScore * 0.3 + affordabilityScore * 0.2)
                .insights(insights)
                .competitorCount((Integer) competitorData.getOrDefault("competitor_count", 0))
                .competitors((List<Map<String, Object>>) competitorData.getOrDefault("competitors", new ArrayList<>()))
                .build();
    }

    private double[] buildFeatureVector(
            PredictionRequestDto request,
            Map<String, Double> demographics,
            Map<String, Object> competitorData) {

        List<String> features = modelLoader.getFeatureColumns();
        double[] vector = new double[features.size()];

        for (int i = 0; i < features.size(); i++) {
            String featureName = features.get(i);
            Double value = demographics.get(featureName);
            vector[i] = value != null ? value : getDefaultFeatureValue(featureName);
        }

        updateFeatureFromCompetitorData(vector, features, "competitor_count", competitorData);
        updateFeatureFromCompetitorData(vector, features, "avg_rating", competitorData);
        updateFeatureFromCompetitorData(vector, features, "competition_density", competitorData);

        Map<String, Double> businessFactors = getBusinessFactors(request.getBusinessType());
        setBusinessFactors(vector, features, businessFactors);
        setPriceFactor(vector, features, request.getPriceRange());
        setAudienceFactor(vector, features, request.getTargetAudience());

        return vector;
    }

    private void updateFeatureFromCompetitorData(double[] vector, List<String> features,
                                                 String featureName, Map<String, Object> competitorData) {
        int idx = features.indexOf(featureName);
        if (idx >= 0 && competitorData.containsKey(featureName)) {
            vector[idx] = ((Number) competitorData.get(featureName)).doubleValue();
        }
    }

    private void setBusinessFactors(double[] vector, List<String> features, Map<String, Double> factors) {
        String[] names = {"business_factor_youth", "business_factor_urban", "business_factor_income"};
        String[] keys = {"youth", "urban", "income"};
        for (int i = 0; i < names.length; i++) {
            int idx = features.indexOf(names[i]);
            if (idx >= 0) {
                vector[idx] = factors.getOrDefault(keys[i], 1.0);
            }
        }
    }

    private void setPriceFactor(double[] vector, List<String> features, String priceRange) {
        int idx = features.indexOf("price_factor");
        if (idx >= 0) {
            double factor = switch (priceRange != null ? priceRange.toLowerCase() : "medium") {
                case "low" -> 1.0;
                case "medium" -> 0.9;
                case "high" -> 0.7;
                default -> 0.9;
            };
            vector[idx] = factor;
        }
    }

    private void setAudienceFactor(double[] vector, List<String> features, String targetAudience) {
        int idx = features.indexOf("audience_factor");
        if (idx >= 0) {
            double factor = switch (targetAudience != null ? targetAudience.toLowerCase() : "general") {
                case "youth" -> 1.2;
                case "family" -> 0.9;
                case "seniors" -> 0.8;
                default -> 1.0;
            };
            vector[idx] = factor;
        }
    }

    private double getDefaultFeatureValue(String featureName) {
        return switch (featureName) {
            case "population_density" -> 50.0;
            case "youth_ratio" -> 0.5;
            case "male_ratio" -> 0.5;
            case "urban_score" -> 0.5;
            case "income_proxy" -> 30000.0;
            case "demand_indicator" -> 0.5;
            case "affluence_score" -> 0.5;
            case "digital_adoption" -> 0.5;
            case "development_index" -> 0.5;
            case "business_factor_youth", "business_factor_urban", "business_factor_income" -> 1.0;
            case "price_factor" -> 0.9;
            case "audience_factor" -> 1.0;
            case "competitor_count" -> 0.0;
            case "avg_rating" -> 0.0;
            case "competition_density" -> 0.0;
            default -> 0.5;
        };
    }

    private Map<String, Double> getBusinessFactors(String businessType) {
        String type = businessType != null ? businessType.toLowerCase() : "general";
        Map<String, Map<String, Double>> factors = Map.of(
                "cafe", Map.of("youth", 1.2, "urban", 1.1, "income", 1.0),
                "gym", Map.of("youth", 1.3, "urban", 1.0, "income", 1.1),
                "clothing_store", Map.of("youth", 1.0, "urban", 1.0, "income", 1.2),
                "restaurant", Map.of("youth", 1.0, "urban", 1.2, "income", 1.0),
                "supermarket", Map.of("youth", 0.8, "urban", 0.8, "income", 1.0),
                "pharmacy", Map.of("youth", 0.7, "urban", 1.0, "income", 1.0)
        );
        return factors.getOrDefault(type, Map.of("youth", 1.0, "urban", 1.0, "income", 1.0));
    }

    private Map<String, Double> getLocationDemographics(String location) {
        Map<String, Double> demographics = new HashMap<>();
        demographics.put("population_density", 55.0);
        demographics.put("youth_ratio", 0.5);
        demographics.put("male_ratio", 0.52);
        demographics.put("urban_score", 0.5);
        demographics.put("income_proxy", 28000.0);
        demographics.put("demand_indicator", 0.5);
        demographics.put("affluence_score", 0.5);
        demographics.put("digital_adoption", 0.5);
        demographics.put("development_index", 0.5);
        return demographics;
    }

    private Map<String, Object> getCompetitorData(PredictionRequestDto request) {
        Map<String, Object> data = new HashMap<>();
        data.put("competitor_count", 0);
        data.put("avg_rating", 0.0);
        data.put("competition_density", 0.0);
        data.put("competitors", new ArrayList<>());
        return data;
    }

    private double calculateDemandScore(Map<String, Double> demographics, PredictionRequestDto request) {
        double popDensity = Math.min(demographics.getOrDefault("population_density", 50.0) / 100, 1.0);
        double youth = Math.min(demographics.getOrDefault("youth_ratio", 0.5), 1.0);
        double urban = Math.min(demographics.getOrDefault("urban_score", 0.5), 1.0);

        Map<String, Double> factors = getBusinessFactors(request.getBusinessType());
        double youthFactor = factors.getOrDefault("youth", 1.0);
        double urbanFactor = factors.getOrDefault("urban", 1.0);

        double youthAdjusted = Math.min(youth * youthFactor, 1.0);
        double urbanAdjusted = Math.min(urban * urbanFactor, 1.0);

        return Math.min(1.0, popDensity * 0.3 + youthAdjusted * 0.4 + urbanAdjusted * 0.3);
    }

    private double calculateCompetitionScore(Map<String, Object> competitorData) {
        int count = (int) competitorData.getOrDefault("competitor_count", 0);
        double rating = ((Number) competitorData.getOrDefault("avg_rating", 0.0)).doubleValue();

        double countScore = Math.max(0, 1 - (count / 15.0));
        double ratingScore = rating > 0 ? rating / 5.0 : 0.5;

        return Math.min(1.0, countScore * 0.6 + ratingScore * 0.4);
    }

    private double calculateAffordabilityScore(Map<String, Double> demographics, PredictionRequestDto request) {
        double income = demographics.getOrDefault("income_proxy", 30000.0);
        Map<String, Double> factors = getBusinessFactors(request.getBusinessType());
        double incomeFactor = factors.getOrDefault("income", 1.0);

        String priceRange = request.getPriceRange() != null ? request.getPriceRange() : "medium";
        double priceFactor = switch (priceRange.toLowerCase()) {
            case "low" -> 1.0;
            case "medium" -> 0.9;
            case "high" -> 0.7;
            default -> 0.9;
        };

        double incomeNorm = Math.min(income / 100000, 1.0);
        return Math.min(1.0, incomeNorm * incomeFactor * priceFactor);
    }

    private List<String> generateInsights(
            double demandScore, double competitionScore, double affordabilityScore,
            double successProb, Map<String, Object> competitorData,
            Map<String, Double> demographics, PredictionRequestDto request) {

        List<String> insights = new ArrayList<>();

        if (demandScore > 0.7) insights.add("✅ High demand potential in this area");
        else if (demandScore > 0.5) insights.add("📈 Moderate demand potential in this area");
        else insights.add("⚠️ Low demand potential in this area");

        int competitorCount = (int) competitorData.getOrDefault("competitor_count", 0);
        if (competitorCount > 10) {
            insights.add("⚠️ High competition - differentiate your offering");
        } else if (competitorCount > 5) {
            insights.add("📊 Moderate competition - focus on quality and service");
        } else if (competitorCount > 0) {
            insights.add("✅ Low competition - good market opportunity");
        } else {
            insights.add("✅ No direct competitors found - first mover advantage!");
        }

        double youth = demographics.getOrDefault("youth_ratio", 0.5);
        double youthFactor = getBusinessFactors(request.getBusinessType()).getOrDefault("youth", 1.0);
        if (youth > 0.6 && youthFactor > 1.0) {
            insights.add("👨‍👩‍👧‍👦 Strong youth demographic - use social media marketing");
            insights.add("📱 Digital presence is crucial for this market");
        }

        double urban = demographics.getOrDefault("urban_score", 0.5);
        double urbanFactor = getBusinessFactors(request.getBusinessType()).getOrDefault("urban", 1.0);
        if (urban > 0.7 && urbanFactor > 1.0) {
            insights.add("🏙️ Urban location - premium pricing possible");
        } else if (urban < 0.3) {
            insights.add("🌾 Rural location - focus on value and community connection");
        }

        if (affordabilityScore > 0.7) {
            insights.add("💳 High affordability - good for premium products");
        } else if (affordabilityScore < 0.4) {
            insights.add("💵 Lower affordability - budget-friendly options recommended");
        }

        double income = demographics.getOrDefault("income_proxy", 30000.0);
        if (income > 50000) {
            insights.add("💼 High income area - good for premium services");
        } else if (income < 25000) {
            insights.add("💼 Moderate income area - focus on value");
        }

        double finalScore = demandScore * 0.5 + competitionScore * 0.3 + affordabilityScore * 0.2;
        if (finalScore > 0.7) {
            insights.add("🌟 **HIGHLY RECOMMENDED** - Excellent location for this business");
        } else if (finalScore > 0.5) {
            insights.add("👍 **SUITABLE** - Good location with moderate potential");
        } else if (finalScore > 0.3) {
            insights.add("⚠️ **CONSIDER ALTERNATIVES** - Lower potential in this location");
        } else {
            insights.add("❌ **NOT RECOMMENDED** - Poor match for this business type");
        }

        return insights;
    }
}
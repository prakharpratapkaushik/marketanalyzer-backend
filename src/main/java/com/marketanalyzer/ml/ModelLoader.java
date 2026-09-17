package com.marketanalyzer.ml;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class ModelLoader {

    private boolean modelLoaded = false;
    private List<String> featureColumns = new ArrayList<>();

    @PostConstruct
    public void init() {
        try {
            log.info("✅ ModelLoader initialized successfully!");
            log.info("📊 Using fallback mode (heuristic predictions)");
            featureColumns = getDefaultFeatureColumns();
            modelLoaded = false;
        } catch (Exception e) {
            log.error("❌ ModelLoader initialization failed: {}", e.getMessage());
            modelLoaded = false;
        }
    }

    private List<String> getDefaultFeatureColumns() {
        return List.of(
                "population_density", "youth_ratio", "male_ratio", "urban_score",
                "income_proxy", "demand_indicator", "affluence_score",
                "digital_adoption", "development_index",
                "business_factor_youth", "business_factor_urban", "business_factor_income",
                "price_factor", "audience_factor",
                "competitor_count", "avg_rating", "competition_density"
        );
    }

    public boolean isModelAvailable() {
        return modelLoaded;
    }

    public double[] predict(double[][] features) {
        return heuristicPredict(features);
    }

    private double[] heuristicPredict(double[][] features) {
        double[] results = new double[features.length];
        for (int i = 0; i < features.length; i++) {
            double[] f = features[i];
            double score = 0.5;

            if (f.length > 0) {
                double popDensity = Math.min(f[0] / 100, 1.0);
                score += popDensity * 0.15;
            }
            if (f.length > 1) {
                double youth = Math.min(f[1], 1.0);
                score += youth * 0.15;
            }
            if (f.length > 3) {
                double urban = Math.min(f[3], 1.0);
                score += urban * 0.1;
            }
            if (f.length > 4) {
                double income = Math.min(f[4] / 100000, 1.0);
                score += income * 0.1;
            }
            if (f.length > 14) {
                double competitors = Math.min(f[14] / 15, 1.0);
                score -= competitors * 0.15;
            }

            results[i] = Math.max(0.1, Math.min(0.9, score));
        }
        return results;
    }

    public List<String> getFeatureColumns() {
        return featureColumns;
    }

    public int getFeatureCount() {
        return featureColumns.size();
    }
}
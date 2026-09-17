package com.marketanalyzer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
@EnableCaching
public class MarketAnalyzerApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketAnalyzerApplication.class, args);
        System.out.println("🚀 MarketAnalyzer Backend Started Successfully!");
        System.out.println("❤️  Health Check: http://localhost:8080/actuator/health");
        System.out.println("📊 Prediction API: http://localhost:8080/api/predict");
    }
}

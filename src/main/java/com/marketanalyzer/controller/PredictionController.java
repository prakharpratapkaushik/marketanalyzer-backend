package com.marketanalyzer.controller;

import com.marketanalyzer.model.dto.PredictionRequestDto;
import com.marketanalyzer.model.dto.PredictionResponseDto;
import com.marketanalyzer.service.PredictionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/predict", "/predict"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PredictionController {

    private final PredictionService predictionService;

    @PostMapping
    public ResponseEntity<PredictionResponseDto> predict(
            @Valid @RequestBody PredictionRequestDto request) {
        return ResponseEntity.ok(predictionService.predict(request));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Prediction Service");
        return ResponseEntity.ok(response);
    }
}

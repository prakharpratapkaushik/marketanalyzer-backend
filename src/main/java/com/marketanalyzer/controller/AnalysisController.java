package com.marketanalyzer.controller;

import com.marketanalyzer.model.dto.AnalysisRequestDto;
import com.marketanalyzer.service.AnalysisService;
import com.marketanalyzer.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {
    private final AnalysisService analysisService;
    private final AuthService authService;

    @PostMapping("/request")
    public ResponseEntity<Map<String, Object>> create(@RequestHeader("Authorization") String authorization,
                                                       @Valid @RequestBody AnalysisRequestDto request) {
        return ResponseEntity.ok(analysisService.create(authService.requireUserEmail(authorization), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> get(@RequestHeader("Authorization") String authorization,
                                                    @PathVariable String id) {
        return ResponseEntity.ok(analysisService.get(authService.requireUserEmail(authorization), id));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> status(@RequestHeader("Authorization") String authorization,
                                                       @PathVariable String id) {
        Map<String, Object> analysis = analysisService.get(authService.requireUserEmail(authorization), id);
        return ResponseEntity.ok(Map.of("id", id, "status", analysis.get("status")));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Map<String, Object>>> list(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(analysisService.list(authService.requireUserEmail(authorization)));
    }
}

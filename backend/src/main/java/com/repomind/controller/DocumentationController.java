package com.repomind.controller;

import com.repomind.dto.DocumentationDto.*;
import com.repomind.service.DocumentationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/repositories/{id}")
public class DocumentationController {

    private final DocumentationService documentationService;

    public DocumentationController(DocumentationService documentationService) {
        this.documentationService = documentationService;
    }

    @GetMapping("/documentation")
    public ResponseEntity<DocumentationResponse> getDocumentation(@PathVariable Long id) {
        return ResponseEntity.ok(documentationService.getDocumentation(id));
    }

    @GetMapping("/docs")
    public ResponseEntity<DocumentationResponse> getDocsAlias(@PathVariable Long id) {
        return ResponseEntity.ok(documentationService.getDocumentation(id));
    }

    @PostMapping("/documentation/generate")
    public ResponseEntity<DocumentationResponse> generateDocumentation(@PathVariable Long id) {
        return ResponseEntity.ok(documentationService.generateDocumentation(id));
    }

    @GetMapping("/onboarding")
    public ResponseEntity<OnboardingGuideDto> getOnboardingGuide(@PathVariable Long id) {
        return ResponseEntity.ok(documentationService.getOnboardingGuide(id));
    }
}

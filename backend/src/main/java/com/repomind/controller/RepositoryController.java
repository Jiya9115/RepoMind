package com.repomind.controller;

import com.repomind.dto.RepositoryDto.*;
import com.repomind.security.SecurityUtils;
import com.repomind.service.RepositoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/repositories")
public class RepositoryController {

    private final RepositoryService repositoryService;

    public RepositoryController(RepositoryService repositoryService) {
        this.repositoryService = repositoryService;
    }

    @GetMapping
    public ResponseEntity<List<RepositoryResponse>> listRepositories() {
        String email = SecurityUtils.getCurrentUserEmail().orElse(null);
        return ResponseEntity.ok(repositoryService.listRepositories(email));
    }

    @GetMapping("/demo")
    public ResponseEntity<RepositoryResponse> getDemoRepository() {
        return ResponseEntity.ok(repositoryService.getDemoRepository());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepositoryResponse> getRepository(@PathVariable Long id) {
        return ResponseEntity.ok(repositoryService.getRepository(id));
    }

    @PostMapping
    public ResponseEntity<RepositoryResponse> importRepository(@RequestBody RepositoryCreateRequest request) {
        String email = SecurityUtils.getCurrentUserEmail().orElse(null);
        return ResponseEntity.ok(repositoryService.importRepository(request, email));
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<Map<String, Object>> triggerAnalysis(@PathVariable Long id) {
        repositoryService.triggerAnalysis(id);
        return ResponseEntity.ok(Map.of(
                "message", "Analysis initiated",
                "repositoryId", id,
                "status", "ANALYZING"
        ));
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<AnalysisStatusResponse> getProgress(@PathVariable Long id) {
        return ResponseEntity.ok(repositoryService.getAnalysisProgress(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRepository(@PathVariable Long id) {
        repositoryService.deleteRepository(id);
        return ResponseEntity.ok(Map.of("message", "Repository deleted successfully"));
    }
}

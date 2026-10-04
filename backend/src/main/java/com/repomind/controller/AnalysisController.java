package com.repomind.controller;

import com.repomind.dto.AnalysisDto.*;
import com.repomind.dto.FileDto.*;
import com.repomind.service.AnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repositories/{id}")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @GetMapping("/files")
    public ResponseEntity<List<FileSummaryDto>> getFiles(@PathVariable Long id) {
        return ResponseEntity.ok(analysisService.getFiles(id));
    }

    @GetMapping("/files/{fileId}")
    public ResponseEntity<FileDetailDto> getFileDetail(@PathVariable Long id, @PathVariable Long fileId) {
        return ResponseEntity.ok(analysisService.getFileDetail(id, fileId));
    }

    @GetMapping("/tree")
    public ResponseEntity<List<TreeNodeDto>> getFileTree(@PathVariable Long id) {
        return ResponseEntity.ok(analysisService.getFileTree(id));
    }

    @GetMapping("/symbols")
    public ResponseEntity<List<CodeSymbolDto>> getSymbols(@PathVariable Long id, @RequestParam(required = false) String q) {
        return ResponseEntity.ok(analysisService.getSymbols(id, q));
    }

    @GetMapping("/dependencies")
    public ResponseEntity<List<DependencyDto>> getDependencies(@PathVariable Long id) {
        return ResponseEntity.ok(analysisService.getDependencies(id));
    }

    @GetMapping("/map")
    public ResponseEntity<CodebaseMapDto> getCodebaseMap(@PathVariable Long id) {
        return ResponseEntity.ok(analysisService.getCodebaseMap(id));
    }

    @GetMapping("/architecture")
    public ResponseEntity<ArchitectureOverviewDto> getArchitecture(@PathVariable Long id) {
        return ResponseEntity.ok(analysisService.getArchitecture(id));
    }

    @GetMapping("/security")
    public ResponseEntity<SecurityOverviewDto> getSecurity(@PathVariable Long id) {
        return ResponseEntity.ok(analysisService.getSecurityOverview(id));
    }

    @GetMapping("/technical-debt")
    public ResponseEntity<TechnicalDebtDto> getTechnicalDebt(@PathVariable Long id) {
        return ResponseEntity.ok(analysisService.getTechnicalDebt(id));
    }

    @GetMapping("/git")
    public ResponseEntity<GitOverviewDto> getGitOverview(@PathVariable Long id) {
        return ResponseEntity.ok(analysisService.getGitOverview(id));
    }
}

package com.repomind.dto;

import java.time.Instant;
import java.util.List;

public class RepositoryDto {

    public record RepositoryCreateRequest(String githubUrl, String branch) {}

    public record RepositoryResponse(
        Long id,
        Long userId,
        String githubUrl,
        String name,
        String description,
        String defaultBranch,
        String analysisStatus,
        Boolean isDemo,
        Instant createdAt,
        Instant updatedAt
    ) {}

    public record ProgressStepDto(String step, String label, String status, String detail) {}

    public record AnalysisStatusResponse(
        Long repositoryId,
        String status,
        Integer progress,
        List<ProgressStepDto> steps,
        String error
    ) {}
}

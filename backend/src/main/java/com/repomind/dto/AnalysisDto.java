package com.repomind.dto;

import java.util.List;
import java.util.Map;

public class AnalysisDto {

    public record DependencyDto(
        Long id,
        String source,
        String target,
        String dependencyType
    ) {}

    public record SecurityFindingDto(
        Long id,
        String file,
        Integer line,
        String severity,
        String category,
        String description,
        String recommendation
    ) {}

    public record SecurityOverviewDto(
        Integer score,
        Integer criticalCount,
        Integer highCount,
        Integer mediumCount,
        Integer lowCount,
        List<SecurityFindingDto> findings
    ) {}

    public record DebtMetricDto(
        String category,
        String name,
        String value,
        String threshold,
        String impact
    ) {}

    public record HotspotDto(
        String file,
        Integer churn,
        Integer complexity,
        Double hotspotScore,
        String reason
    ) {}

    public record TechnicalDebtDto(
        Integer debtScore,
        Double estimatedRemediationHours,
        Integer totalTodos,
        Integer highComplexityFunctions,
        Integer largeFilesCount,
        List<HotspotDto> hotspots,
        List<DebtMetricDto> metrics,
        String explanation
    ) {}

    public record GitCommitDto(
        String hash,
        String author,
        String authorEmail,
        String message,
        String date
    ) {}

    public record GitContributorDto(
        String name,
        String email,
        Integer commits,
        Double percentage
    ) {}

    public record GitChurnDto(String file, Integer churn) {}

    public record GitOverviewDto(
        Integer totalCommits,
        List<GitContributorDto> contributors,
        List<GitCommitDto> recentCommits,
        List<GitChurnDto> topChurnedFiles,
        List<HotspotDto> codeHotspots
    ) {}

    public record ArchitectureNodeDto(
        String id,
        String name,
        String path,
        String tier,
        Long fileId,
        String description
    ) {}

    public record ArchitectureEdgeDto(
        String source,
        String target,
        String label
    ) {}

    public record ArchitectureOverviewDto(
        Map<String, List<ArchitectureNodeDto>> tiers,
        List<ArchitectureEdgeDto> edges,
        String summary
    ) {}

    public record MapNodeDto(
        String id,
        String type,
        Map<String, Object> data,
        Map<String, Object> position,
        Map<String, Object> style
    ) {}

    public record MapEdgeDto(
        String id,
        String source,
        String target,
        Boolean animated,
        Map<String, Object> style
    ) {}

    public record CodebaseMapDto(
        List<MapNodeDto> nodes,
        List<MapEdgeDto> edges,
        Map<String, Object> stats
    ) {}
}

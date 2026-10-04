package com.repomind.dto;

import java.util.List;
import java.util.Map;

public class DocumentationDto {

    public record DocItemDto(
        String title,
        String docType,
        String filename,
        String content
    ) {}

    public record DocumentationResponse(
        Long repositoryId,
        String repositoryName,
        List<DocItemDto> documents
    ) {}

    public record OnboardingStepDto(
        String title,
        String description,
        String codeReference,
        String actionItem
    ) {}

    public record ReadingOrderDto(
        Integer order,
        String filePath,
        String title,
        String reason,
        List<String> keySymbols
    ) {}

    public record OnboardingGuideDto(
        String projectOverview,
        String startupInstructions,
        String architectureOverview,
        List<Map<String, String>> keyDirectories,
        List<Map<String, String>> entryPoints,
        List<OnboardingStepDto> authFlow,
        List<OnboardingStepDto> databaseFlow,
        List<OnboardingStepDto> apiFlow,
        List<ReadingOrderDto> recommendedReadingOrder
    ) {}
}

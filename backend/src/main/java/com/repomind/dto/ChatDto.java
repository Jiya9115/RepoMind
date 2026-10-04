package com.repomind.dto;

import java.time.Instant;
import java.util.List;

public class ChatDto {

    public record SourceCitationDto(
        String file,
        Integer startLine,
        Integer endLine,
        String snippet,
        String description
    ) {}

    public record ChatRequest(
        String message,
        Long sessionId,
        String contextFile
    ) {}

    public record ChatMessageDto(
        Long id,
        String role,
        String content,
        List<SourceCitationDto> sources,
        Instant createdAt
    ) {}

    public record ChatResponse(
        Long sessionId,
        ChatMessageDto message,
        Boolean isDemoMode,
        String provider
    ) {}

    public record ChatSessionDto(
        Long id,
        Long repositoryId,
        String title,
        Instant createdAt,
        List<ChatMessageDto> messages
    ) {}
}

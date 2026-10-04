package com.repomind.dto;

import java.util.List;

public class FileDto {

    public record CodeSymbolDto(
        Long id,
        Long fileId,
        String name,
        String type,
        Integer startLine,
        Integer endLine
    ) {}

    public record FileSummaryDto(
        Long id,
        Long repositoryId,
        String path,
        String language,
        Long size,
        Integer lineCount,
        Integer symbolCount
    ) {}

    public record FileDetailDto(
        Long id,
        Long repositoryId,
        String path,
        String language,
        Long size,
        Integer lineCount,
        String content,
        String contentHash,
        List<CodeSymbolDto> symbols
    ) {}

    public record TreeNodeDto(
        String id,
        String name,
        String path,
        String type, // file or folder
        String language,
        Long size,
        Long fileId,
        List<TreeNodeDto> children
    ) {}
}

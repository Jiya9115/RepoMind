package com.repomind.ai;

import com.repomind.model.CodeSymbol;
import com.repomind.model.Dependency;
import com.repomind.model.RepositoryFile;
import com.repomind.repository.CodeSymbolRepository;
import com.repomind.repository.DependencyRepository;
import com.repomind.repository.RepositoryFileRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RagService {

    private final RepositoryFileRepository fileRepository;
    private final CodeSymbolRepository symbolRepository;
    private final DependencyRepository dependencyRepository;

    public RagService(
            RepositoryFileRepository fileRepository,
            CodeSymbolRepository symbolRepository,
            DependencyRepository dependencyRepository) {
        this.fileRepository = fileRepository;
        this.symbolRepository = symbolRepository;
        this.dependencyRepository = dependencyRepository;
    }

    public record RetrievalResult(
            List<Map<String, Object>> snippets,
            List<String> dependencies
    ) {}

    public RetrievalResult retrieveContext(Long repoId, String query, String contextFile) {
        List<Map<String, Object>> snippets = new ArrayList<>();
        List<String> deps = new ArrayList<>();

        if (contextFile != null && !contextFile.isBlank()) {
            fileRepository.findByRepositoryIdAndPath(repoId, contextFile).ifPresent(f -> {
                snippets.add(buildSnippet(f));
            });
        }

        // Search files matching terms in query
        String[] terms = query.toLowerCase().split("\\s+");
        List<RepositoryFile> allFiles = fileRepository.findByRepositoryId(repoId);

        for (RepositoryFile f : allFiles) {
            if (snippets.size() >= 4) break;
            if (contextFile != null && f.getPath().equals(contextFile)) continue;

            for (String t : terms) {
                if (t.length() > 3 && (f.getPath().toLowerCase().contains(t) || (f.getContent() != null && f.getContent().toLowerCase().contains(t)))) {
                    snippets.add(buildSnippet(f));
                    break;
                }
            }
        }

        if (snippets.isEmpty() && !allFiles.isEmpty()) {
            for (int i = 0; i < Math.min(3, allFiles.size()); i++) {
                snippets.add(buildSnippet(allFiles.get(i)));
            }
        }

        // Get dependencies
        List<Dependency> dependencies = dependencyRepository.findByRepositoryId(repoId);
        for (Dependency d : dependencies) {
            deps.add(d.getSource() + " -> " + d.getTarget());
        }

        return new RetrievalResult(snippets, deps);
    }

    private Map<String, Object> buildSnippet(RepositoryFile f) {
        Map<String, Object> snippet = new HashMap<>();
        snippet.put("path", f.getPath());
        snippet.put("language", f.getLanguage());
        snippet.put("startLine", 1);
        int totalLines = f.getLineCount() != null ? f.getLineCount() : 1;
        snippet.put("endLine", Math.min(totalLines, 60));

        String content = f.getContent() != null ? f.getContent() : "";
        if (content.length() > 1500) {
            content = content.substring(0, 1500) + "\n... [truncated for context]";
        }
        snippet.put("content", content);
        return snippet;
    }
}

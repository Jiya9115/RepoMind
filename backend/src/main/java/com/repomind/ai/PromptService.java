package com.repomind.ai;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PromptService {

    public String buildGroundedPrompt(
            String userQuestion,
            List<Map<String, Object>> retrievedSnippets,
            List<String> dependencies,
            String architectureContext) {

        StringBuilder sb = new StringBuilder();
        sb.append("You are RepoMind AI, an elite software engineering intelligence assistant.\n");
        sb.append("Your mission is to provide accurate, grounded architectural and code intelligence.\n");
        sb.append("Always cite exact file paths and line ranges.\n\n");

        if (architectureContext != null && !architectureContext.isBlank()) {
            sb.append("ARCHITECTURE OVERVIEW:\n").append(architectureContext).append("\n\n");
        }

        if (dependencies != null && !dependencies.isEmpty()) {
            sb.append("DEPENDENCY GRAPH CONTEXT:\n");
            for (String dep : dependencies) {
                sb.append("- ").append(dep).append("\n");
            }
            sb.append("\n");
        }

        sb.append("RELEVANT CODE EXCERPTS:\n");
        for (Map<String, Object> snippet : retrievedSnippets) {
            sb.append(String.format("--- File: %s (lines %s-%s) ---\n",
                    snippet.get("path"), snippet.get("startLine"), snippet.get("endLine")));
            sb.append(snippet.get("content")).append("\n\n");
        }

        sb.append("DEVELOPER QUESTION: ").append(userQuestion).append("\n\n");
        sb.append("Please provide a thorough, structured technical answer referencing the files and lines above.");

        return sb.toString();
    }
}

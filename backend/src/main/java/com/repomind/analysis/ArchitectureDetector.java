package com.repomind.analysis;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ArchitectureDetector {

    public record ArchitectureNodeInfo(String id, String name, String path, String tier, String description) {}
    public record ArchitectureEdgeInfo(String source, String target, String label) {}
    public record ArchitectureResult(
            Map<String, List<ArchitectureNodeInfo>> tiers,
            List<ArchitectureEdgeInfo> edges,
            String summary
    ) {}

    public ArchitectureResult detect(List<String> filePaths) {
        Map<String, List<ArchitectureNodeInfo>> tiers = new LinkedHashMap<>();
        tiers.put("Frontend", new ArrayList<>());
        tiers.put("Controllers & API", new ArrayList<>());
        tiers.put("Services & Logic", new ArrayList<>());
        tiers.put("Database & Storage", new ArrayList<>());
        tiers.put("Authentication", new ArrayList<>());
        tiers.put("Utilities & Config", new ArrayList<>());

        for (String path : filePaths) {
            String lower = path.toLowerCase();
            String name = path.substring(path.lastIndexOf('/') + 1);

            String tier = "Utilities & Config";
            if (lower.contains("auth") || lower.contains("jwt") || lower.contains("security") || lower.contains("token")) {
                tier = "Authentication";
            } else if (lower.contains("frontend") || lower.endsWith(".tsx") || lower.endsWith(".jsx") || lower.endsWith(".css") || lower.endsWith(".html")) {
                tier = "Frontend";
            } else if (lower.contains("database") || lower.contains("models") || lower.contains("repository") || lower.contains("schema") || lower.endsWith(".sql")) {
                tier = "Database & Storage";
            } else if (lower.contains("service") || lower.contains("manager") || lower.contains("business")) {
                tier = "Services & Logic";
            } else if (lower.contains("controller") || lower.contains("api") || lower.contains("router") || lower.contains("endpoint") || lower.contains("main")) {
                tier = "Controllers & API";
            }

            tiers.get(tier).add(new ArchitectureNodeInfo(
                    path,
                    name,
                    path,
                    tier,
                    tier + " component (" + name + ")"
            ));
        }

        List<ArchitectureEdgeInfo> edges = new ArrayList<>();
        if (!tiers.get("Frontend").isEmpty() && !tiers.get("Controllers & API").isEmpty()) {
            edges.add(new ArchitectureEdgeInfo(
                    tiers.get("Frontend").getFirst().id(),
                    tiers.get("Controllers & API").getFirst().id(),
                    "REST / HTTP Calls"
            ));
        }
        if (!tiers.get("Controllers & API").isEmpty() && !tiers.get("Services & Logic").isEmpty()) {
            edges.add(new ArchitectureEdgeInfo(
                    tiers.get("Controllers & API").getFirst().id(),
                    tiers.get("Services & Logic").getFirst().id(),
                    "Invokes Business Logic"
            ));
        }
        if (!tiers.get("Services & Logic").isEmpty() && !tiers.get("Database & Storage").isEmpty()) {
            edges.add(new ArchitectureEdgeInfo(
                    tiers.get("Services & Logic").getFirst().id(),
                    tiers.get("Database & Storage").getFirst().id(),
                    "Queries & Transactions"
            ));
        }
        if (!tiers.get("Controllers & API").isEmpty() && !tiers.get("Authentication").isEmpty()) {
            edges.add(new ArchitectureEdgeInfo(
                    tiers.get("Controllers & API").getFirst().id(),
                    tiers.get("Authentication").getFirst().id(),
                    "Token & Auth Guard"
            ));
        }

        String summary = String.format(
                "Layered architecture with %d Frontend modules, %d API endpoints, %d Domain services, and %d Storage models.",
                tiers.get("Frontend").size(),
                tiers.get("Controllers & API").size(),
                tiers.get("Services & Logic").size(),
                tiers.get("Database & Storage").size()
        );

        return new ArchitectureResult(tiers, edges, summary);
    }
}

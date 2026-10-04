package com.repomind.analysis;

import com.repomind.dto.AnalysisDto.*;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class CodebaseMapBuilder {

    public record CodebaseMapData(
            List<MapNodeDto> nodes,
            List<MapEdgeDto> edges,
            Map<String, Object> stats
    ) {}

    public CodebaseMapData buildMap(
            List<Map<String, Object>> files,
            List<Map<String, String>> dependencies,
            List<Map<String, Object>> securityFindings) {

        List<MapNodeDto> nodes = new ArrayList<>();
        List<MapEdgeDto> edges = new ArrayList<>();

        // Group security findings by file
        Map<String, List<Map<String, Object>>> secByFile = new HashMap<>();
        for (Map<String, Object> sec : securityFindings) {
            String fpath = (String) sec.get("file");
            secByFile.computeIfAbsent(fpath, k -> new ArrayList<>()).add(sec);
        }

        // Group files by top-level or second-level directory
        Map<String, List<Map<String, Object>>> clusters = new LinkedHashMap<>();
        for (Map<String, Object> f : files) {
            String path = (String) f.get("path");
            String[] parts = path.split("/");
            String folder = parts.length > 1 ? parts[0] : "root";
            clusters.computeIfAbsent(folder, k -> new ArrayList<>()).add(f);
        }

        int clusterIdx = 0;
        for (Map.Entry<String, List<Map<String, Object>>> entry : clusters.entrySet()) {
            String folder = entry.getKey();
            List<Map<String, Object>> folderFiles = entry.getValue();

            int col = clusterIdx % 3;
            int row = clusterIdx / 3;
            int baseX = 80 + (col * 360);
            int baseY = 80 + (row * 320);

            // Folder Group Node
            Map<String, Object> groupData = new HashMap<>();
            groupData.put("label", "📁 " + folder + "/");
            groupData.put("fileCount", folderFiles.size());
            groupData.put("folder", folder);

            Map<String, Object> groupPos = new HashMap<>();
            groupPos.put("x", baseX - 20);
            groupPos.put("y", baseY - 35);

            Map<String, Object> groupStyle = new HashMap<>();
            groupStyle.put("width", 320);
            groupStyle.put("height", Math.max(220, 60 + folderFiles.size() * 65));
            groupStyle.put("backgroundColor", "rgba(19, 23, 34, 0.4)");
            groupStyle.put("border", "1px dashed #28314a");
            groupStyle.put("borderRadius", "12px");
            groupStyle.put("zIndex", -1);

            nodes.add(new MapNodeDto("group_" + folder, "folderGroup", groupData, groupPos, groupStyle));

            // File Nodes inside this cluster
            for (int i = 0; i < folderFiles.size(); i++) {
                Map<String, Object> file = folderFiles.get(i);
                String path = (String) file.get("path");
                String name = path.substring(path.lastIndexOf('/') + 1);

                List<Map<String, Object>> fileSec = secByFile.getOrDefault(path, Collections.emptyList());
                boolean hasSec = !fileSec.isEmpty();
                String maxSeverity = "NONE";
                if (hasSec) {
                    boolean hasCrit = fileSec.stream().anyMatch(s -> "CRITICAL".equalsIgnoreCase((String) s.get("severity")));
                    maxSeverity = hasCrit ? "CRITICAL" : "HIGH";
                }

                int lineCount = (int) file.getOrDefault("lineCount", 0);
                boolean isDebtHotspot = lineCount > 100;

                Map<String, Object> nodeData = new HashMap<>();
                nodeData.put("label", name);
                nodeData.put("path", path);
                nodeData.put("fileId", file.get("id"));
                nodeData.put("language", file.getOrDefault("language", "plaintext"));
                nodeData.put("lineCount", lineCount);
                nodeData.put("hasSecurityWarning", hasSec);
                nodeData.put("securityCount", fileSec.size());
                nodeData.put("securitySeverity", maxSeverity);
                nodeData.put("hasDebtAlert", isDebtHotspot);

                Map<String, Object> nodePos = new HashMap<>();
                nodePos.put("x", baseX + 10);
                nodePos.put("y", baseY + (i * 65));

                nodes.add(new MapNodeDto(path, "fileNode", nodeData, nodePos, Collections.emptyMap()));
            }

            clusterIdx++;
        }

        // Edges
        int edgeIdx = 0;
        Set<String> filePathSet = new HashSet<>();
        for (Map<String, Object> f : files) {
            filePathSet.add((String) f.get("path"));
        }

        for (Map<String, String> dep : dependencies) {
            String src = dep.get("source");
            String tgt = dep.get("target");
            if (filePathSet.contains(src) && filePathSet.contains(tgt) && !src.equals(tgt)) {
                edgeIdx++;
                Map<String, Object> edgeStyle = new HashMap<>();
                edgeStyle.put("stroke", "#38bdf8");
                edgeStyle.put("strokeWidth", 1.5);
                edgeStyle.put("opacity", 0.65);

                edges.add(new MapEdgeDto("edge_" + edgeIdx, src, tgt, true, edgeStyle));
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalNodes", nodes.size());
        stats.put("totalEdges", edges.size());
        stats.put("clusters", clusters.size());

        return new CodebaseMapData(nodes, edges, stats);
    }
}

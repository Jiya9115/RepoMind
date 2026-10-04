package com.repomind.analysis;

import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Component
public class DependencyExtractor {

    public record ExtractedDependency(String source, String target, String dependencyType) {}

    public List<ExtractedDependency> resolveDependencies(
            List<String> allFilePaths,
            Map<String, List<String>> fileImports) {

        List<ExtractedDependency> result = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        Set<String> pathSet = new HashSet<>(allFilePaths);

        for (Map.Entry<String, List<String>> entry : fileImports.entrySet()) {
            String sourcePath = entry.getKey();
            List<String> imports = entry.getValue();

            for (String imp : imports) {
                String matchedTarget = matchImportToPath(sourcePath, imp, pathSet);
                if (matchedTarget != null && !matchedTarget.equals(sourcePath)) {
                    String key = sourcePath + "->" + matchedTarget;
                    if (!seen.contains(key)) {
                        seen.add(key);
                        result.add(new ExtractedDependency(sourcePath, matchedTarget, "INTERNAL_IMPORT"));
                    }
                } else if (!imp.startsWith(".")) {
                    // External dependency
                    String pkg = imp.split("\\.")[0].split("/")[0];
                    String key = sourcePath + "->" + pkg;
                    if (!seen.contains(key)) {
                        seen.add(key);
                        result.add(new ExtractedDependency(sourcePath, pkg, "EXTERNAL_PACKAGE"));
                    }
                }
            }
        }

        return result;
    }

    private String matchImportToPath(String sourcePath, String imp, Set<String> allPaths) {
        // 1. Relative import (JS/TS)
        if (imp.startsWith(".")) {
            try {
                Path sourceDir = Paths.get(sourcePath).getParent();
                if (sourceDir == null) sourceDir = Paths.get("");
                String[] exts = {"", ".ts", ".tsx", ".js", ".jsx", ".java"};
                for (String ext : exts) {
                    Path candidate = sourceDir.resolve(imp + ext).normalize();
                    String candStr = candidate.toString().replace("\\", "/");
                    if (allPaths.contains(candStr)) {
                        return candStr;
                    }
                }
            } catch (Exception ignored) {}
        }

        // 2. Java package / class import or full name match
        String normalizedImp = imp.replace(".", "/");
        for (String path : allPaths) {
            String pathNoExt = path.contains(".") ? path.substring(0, path.lastIndexOf('.')) : path;
            if (pathNoExt.endsWith(normalizedImp) || normalizedImp.endsWith(pathNoExt.substring(pathNoExt.lastIndexOf('/') + 1))) {
                return path;
            }
        }

        return null;
    }
}

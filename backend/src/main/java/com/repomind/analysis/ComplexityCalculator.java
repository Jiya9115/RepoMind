package com.repomind.analysis;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ComplexityCalculator {

    private static final Pattern BRANCH_PATTERN = Pattern.compile(
            "\\b(if|else\\s+if|for|while|catch|case)\\b|&&|\\|\\||\\?"
    );

    private static final Pattern TODO_PATTERN = Pattern.compile(
            "\\b(TODO|FIXME|HACK|XXX|OPTIMIZE)\\b[:\\s]*(.*)",
            Pattern.CASE_INSENSITIVE
    );

    public record FileComplexity(
            String path,
            int lineCount,
            int cyclomaticComplexity,
            boolean isLargeFile,
            boolean isHighComplexity,
            List<String> todos
    ) {}

    public record DebtCalculationResult(
            int debtScore,
            double remediationHours,
            int totalTodos,
            int highComplexityModules,
            int oversizedFiles,
            String explanation
    ) {}

    public FileComplexity analyzeFile(String path, String content) {
        String[] lines = content.split("\r?\n");
        int lineCount = lines.length;
        int complexity = 1;
        List<String> todos = new ArrayList<>();

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.startsWith("//") || line.startsWith("#") || line.startsWith("*") || line.startsWith("/*")) {
                Matcher tm = TODO_PATTERN.matcher(line);
                if (tm.find()) {
                    todos.add("Line " + (i + 1) + ": " + tm.group(1).toUpperCase() + " " + tm.group(2).trim());
                }
                continue;
            }

            Matcher bm = BRANCH_PATTERN.matcher(line);
            while (bm.find()) {
                complexity++;
            }

            Matcher tm = TODO_PATTERN.matcher(line);
            if (tm.find()) {
                todos.add("Line " + (i + 1) + ": " + tm.group(1).toUpperCase() + " " + tm.group(2).trim());
            }
        }

        return new FileComplexity(
                path,
                lineCount,
                complexity,
                lineCount > 250,
                complexity > 12,
                todos
        );
    }

    public DebtCalculationResult calculateDebt(List<FileComplexity> fileMetrics) {
        int totalFiles = Math.max(1, fileMetrics.size());
        int totalTodos = fileMetrics.stream().mapToInt(f -> f.todos().size()).sum();
        int highComplexity = (int) fileMetrics.stream().filter(FileComplexity::isHighComplexity).count();
        int oversized = (int) fileMetrics.stream().filter(FileComplexity::isLargeFile).count();

        // Score formula: 100 minus weighted penalties
        int deduction = (highComplexity * 6) + (oversized * 4) + (totalTodos * 2);
        int score = Math.max(25, Math.min(98, 100 - deduction));

        double hours = (highComplexity * 3.5) + (oversized * 2.0) + (totalTodos * 0.75);

        String explanation = String.format(
                "Calculated across %d discovered source files. Technical Debt reflects deductions from " +
                "%d high-complexity branching routines, %d oversized file boundaries, and %d documented maintenance markers.",
                totalFiles, highComplexity, oversized, totalTodos
        );

        return new DebtCalculationResult(score, Math.round(hours * 10.0) / 10.0, totalTodos, highComplexity, oversized, explanation);
    }
}

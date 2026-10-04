package com.repomind.analysis;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class SecurityAuditor {

    public record AuditFinding(
            String file,
            int line,
            String severity,
            String category,
            String description,
            String recommendation
    ) {}

    private record SecurityRule(
            Pattern pattern,
            String severity,
            String category,
            String description,
            String recommendation
    ) {}

    private final List<SecurityRule> rules = List.of(
            new SecurityRule(
                    Pattern.compile("(?:JWT_SECRET|SECRET_KEY|API_KEY|PASSWORD|TOKEN)\\s*=\\s*['\"]([a-zA-Z0-9_\\-!@#$%^&*]{8,})['\"]", Pattern.CASE_INSENSITIVE),
                    "HIGH",
                    "Hardcoded Secret",
                    "Hardcoded secret key or sensitive credential identified in source code.",
                    "Externalize credentials into environment variables or secrets manager."
            ),
            new SecurityRule(
                    Pattern.compile("(?:SELECT\\s+.*FROM\\s+.*\\+\\s*[A-Za-z0-9_]+|f['\"].*SELECT\\s+.*FROM|SELECT\\s+.*%s)", Pattern.CASE_INSENSITIVE),
                    "CRITICAL",
                    "SQL Injection",
                    "Unescaped raw SQL query constructed with string concatenation or interpolation.",
                    "Use parameterized PreparedStatements or ORM query abstractions."
            ),
            new SecurityRule(
                    Pattern.compile("\\b(?:eval|exec)\\s*\\("),
                    "CRITICAL",
                    "Remote Code Execution",
                    "Dynamic code execution via eval() or exec() facilitates arbitrary script execution.",
                    "Eliminate dynamic evaluation; use structured parsers like Jackson or JSON libraries."
            ),
            new SecurityRule(
                    Pattern.compile("(?:Runtime\\.getRuntime\\(\\)\\.exec\\(|ProcessBuilder\\()"),
                    "HIGH",
                    "Unsafe Process Execution",
                    "Spawning OS system processes directly can introduce command injection risks.",
                    "Sanitize command inputs thoroughly or avoid invoking system shell utilities."
            ),
            new SecurityRule(
                    Pattern.compile("allow_origins\\s*=\\s*\\[\\s*['\"]\\*['\"]\\s*\\]|\\.allowedOrigins\\(\"\\*\"\\)"),
                    "MEDIUM",
                    "Permissive CORS",
                    "Wildcard CORS origin ('*') allows any external browser context to make requests.",
                    "Restrict allowed origins to trusted domain names."
            )
    );

    public List<AuditFinding> auditFile(String path, String content) {
        List<AuditFinding> findings = new ArrayList<>();
        String[] lines = content.split("\r?\n");

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.startsWith("//") || line.startsWith("#") || line.startsWith("*") || line.startsWith("/*")) {
                continue;
            }

            for (SecurityRule rule : rules) {
                if (rule.pattern.matcher(line).find()) {
                    findings.add(new AuditFinding(
                            path,
                            i + 1,
                            rule.severity,
                            rule.category,
                            rule.description,
                            rule.recommendation
                    ));
                }
            }
        }

        return findings;
    }

    public int calculateSecurityScore(List<AuditFinding> findings) {
        long critical = findings.stream().filter(f -> "CRITICAL".equalsIgnoreCase(f.severity)).count();
        long high = findings.stream().filter(f -> "HIGH".equalsIgnoreCase(f.severity)).count();
        long medium = findings.stream().filter(f -> "MEDIUM".equalsIgnoreCase(f.severity)).count();
        long low = findings.stream().filter(f -> "LOW".equalsIgnoreCase(f.severity)).count();

        int penalty = (int) (critical * 25 + high * 10 + medium * 4 + low * 1);
        return Math.max(20, Math.min(100, 100 - penalty));
    }
}

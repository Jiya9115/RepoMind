package com.repomind.analysis;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class SecurityAuditorTest {

    private final SecurityAuditor auditor = new SecurityAuditor();

    @Test
    void testAuditHardcodedSecretAndSqlInjection() {
        String code = """
                public class AuthTest {
                    String JWT_SECRET = "super-secret-production-key-12345";
                    
                    public void query(String user) {
                        String sql = "SELECT * FROM users WHERE name = '" + user;
                    }
                }
                """;

        List<SecurityAuditor.AuditFinding> findings = auditor.auditFile("AuthTest.java", code);
        assertNotNull(findings);
        assertTrue(findings.size() >= 2);

        boolean hasSecret = findings.stream().anyMatch(f -> "Hardcoded Secret".equals(f.category()));
        boolean hasSql = findings.stream().anyMatch(f -> "SQL Injection".equals(f.category()));
        assertTrue(hasSecret, "Expected hardcoded secret to be flagged");
        assertTrue(hasSql, "Expected SQL injection to be flagged");

        int score = auditor.calculateSecurityScore(findings);
        assertTrue(score < 90, "Security score should be reduced for severe findings");
    }
}

package com.repomind.analysis;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JavaCodeParserTest {

    private final JavaCodeParser parser = new JavaCodeParser();

    @Test
    void testParseJavaSymbols() {
        String javaCode = """
                package com.example.service;
                
                import java.util.List;
                import java.time.Instant;
                
                public class PaymentService {
                    private String apiKey;
                    
                    public boolean processPayment(Long orderId, Double amount) {
                        if (amount <= 0) {
                            return false;
                        }
                        return true;
                    }
                }
                """;

        var result = parser.parseJava(javaCode);
        assertNotNull(result);
        assertEquals(2, result.imports().size());
        assertTrue(result.imports().contains("java.util.List"));

        boolean hasClass = result.symbols().stream().anyMatch(s -> "PaymentService".equals(s.name()) && "CLASS".equals(s.type()));
        boolean hasMethod = result.symbols().stream().anyMatch(s -> "processPayment".equals(s.name()) && "METHOD".equals(s.type()));
        assertTrue(hasClass, "Expected PaymentService class to be extracted");
        assertTrue(hasMethod, "Expected processPayment method to be extracted");
    }
}

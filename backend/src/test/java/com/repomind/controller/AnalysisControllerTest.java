package com.repomind.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AnalysisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testDemoRepositoryEndpoints() throws Exception {
        // 1. Get demo repo
        var result = mockMvc.perform(get("/api/repositories/demo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("demo-shop"))
                .andReturn();

        // 2. Files
        mockMvc.perform(get("/api/repositories/1/files"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        // 3. Architecture
        mockMvc.perform(get("/api/repositories/1/architecture"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tiers").isMap());

        // 4. Security
        mockMvc.perform(get("/api/repositories/1/security"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").isNumber())
                .andExpect(jsonPath("$.findings").isArray());

        // 5. Technical debt
        mockMvc.perform(get("/api/repositories/1/technical-debt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.debtScore").isNumber());

        // 6. Codebase Map
        mockMvc.perform(get("/api/repositories/1/map"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nodes").isArray())
                .andExpect(jsonPath("$.edges").isArray());

        // 7. Onboarding Guide
        mockMvc.perform(get("/api/repositories/1/onboarding"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recommendedReadingOrder").isArray());
    }
}

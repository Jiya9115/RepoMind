package com.repomind.controller;

import com.repomind.ai.AiService;
import com.repomind.dto.ChatDto.*;
import com.repomind.security.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repositories/{id}")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @PathVariable Long id,
            @RequestBody ChatRequest request) {
        String email = SecurityUtils.getCurrentUserEmail().orElse(null);
        return ResponseEntity.ok(aiService.chat(id, request, email));
    }

    @GetMapping("/chat/sessions")
    public ResponseEntity<List<ChatSessionDto>> listSessions(@PathVariable Long id) {
        return ResponseEntity.ok(aiService.listSessions(id));
    }
}

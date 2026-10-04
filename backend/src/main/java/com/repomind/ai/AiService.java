package com.repomind.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.repomind.dto.ChatDto.*;
import com.repomind.model.ChatMessage;
import com.repomind.model.ChatSession;
import com.repomind.model.RepositoryEntity;
import com.repomind.model.User;
import com.repomind.repository.ChatMessageRepository;
import com.repomind.repository.ChatSessionRepository;
import com.repomind.repository.RepositoryEntityRepository;
import com.repomind.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class AiService {

    private final GeminiAiService geminiAiService;
    private final DemoAiService demoAiService;
    private final PromptService promptService;
    private final RagService ragService;

    private final RepositoryEntityRepository repoRepository;
    private final ChatSessionRepository sessionRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public AiService(
            GeminiAiService geminiAiService,
            DemoAiService demoAiService,
            PromptService promptService,
            RagService ragService,
            RepositoryEntityRepository repoRepository,
            ChatSessionRepository sessionRepository,
            ChatMessageRepository messageRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper) {
        this.geminiAiService = geminiAiService;
        this.demoAiService = demoAiService;
        this.promptService = promptService;
        this.ragService = ragService;
        this.repoRepository = repoRepository;
        this.sessionRepository = sessionRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ChatResponse chat(Long repoId, ChatRequest request, String userEmail) {
        RepositoryEntity repo = repoRepository.findById(repoId)
                .orElseThrow(() -> new IllegalArgumentException("Repository not found with ID: " + repoId));

        User user = null;
        if (userEmail != null) {
            user = userRepository.findByEmail(userEmail).orElse(null);
        }

        ChatSession session = null;
        if (request.sessionId() != null) {
            session = sessionRepository.findById(request.sessionId()).orElse(null);
        }
        if (session == null) {
            String title = request.message().length() > 35 ? request.message().substring(0, 35) + "..." : request.message();
            session = sessionRepository.save(new ChatSession(user, repo, title));
        }

        // Save user message
        messageRepository.save(new ChatMessage(session, "user", request.message(), "[]"));

        // Grounded synthesis
        String answerContent;
        List<SourceCitationDto> citations;
        boolean isDemo = true;
        String provider = "DEMO_INTELLIGENCE";

        if (geminiAiService.isAvailable()) {
            try {
                var context = ragService.retrieveContext(repoId, request.message(), request.contextFile());
                String prompt = promptService.buildGroundedPrompt(request.message(), context.snippets(), context.dependencies(), "Layered system");
                answerContent = geminiAiService.generateResponse(prompt);
                citations = demoAiService.answerQuery(request.message()).citations();
                isDemo = false;
                provider = "GEMINI_1.5_FLASH";
            } catch (Exception e) {
                var demoRes = demoAiService.answerQuery(request.message());
                answerContent = demoRes.content();
                citations = demoRes.citations();
            }
        } else {
            var demoRes = demoAiService.answerQuery(request.message());
            answerContent = demoRes.content();
            citations = demoRes.citations();
        }

        String sourcesJson = "[]";
        try {
            sourcesJson = objectMapper.writeValueAsString(citations);
        } catch (Exception ignored) {}

        ChatMessage assistantMsg = messageRepository.save(new ChatMessage(session, "assistant", answerContent, sourcesJson));

        ChatMessageDto msgDto = new ChatMessageDto(
                assistantMsg.getId(),
                "assistant",
                assistantMsg.getContent(),
                citations,
                assistantMsg.getCreatedAt()
        );

        return new ChatResponse(session.getId(), msgDto, isDemo, provider);
    }

    public List<ChatSessionDto> listSessions(Long repoId) {
        List<ChatSession> sessions = sessionRepository.findByRepositoryIdOrderByCreatedAtDesc(repoId);
        List<ChatSessionDto> dtos = new ArrayList<>();
        for (ChatSession s : sessions) {
            List<ChatMessage> msgs = messageRepository.findBySessionIdOrderByCreatedAtAsc(s.getId());
            List<ChatMessageDto> msgDtos = msgs.stream().map(m -> {
                List<SourceCitationDto> sources = new ArrayList<>();
                try {
                    if (m.getSourcesJson() != null && !m.getSourcesJson().isBlank()) {
                        sources = List.of(objectMapper.readValue(m.getSourcesJson(), SourceCitationDto[].class));
                    }
                } catch (Exception ignored) {}
                return new ChatMessageDto(m.getId(), m.getRole(), m.getContent(), sources, m.getCreatedAt());
            }).toList();
            dtos.add(new ChatSessionDto(s.getId(), repoId, s.getTitle(), s.getCreatedAt(), msgDtos));
        }
        return dtos;
    }
}

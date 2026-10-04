package com.repomind;

import com.repomind.analysis.AnalysisPipeline;
import com.repomind.model.RepositoryEntity;
import com.repomind.model.User;
import com.repomind.repository.RepositoryEntityRepository;
import com.repomind.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.Map;

@SpringBootApplication
public class RepoMindApplication {

    private static final Logger log = LoggerFactory.getLogger(RepoMindApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(RepoMindApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedDemoData(
            UserRepository userRepository,
            RepositoryEntityRepository repositoryEntityRepository,
            AnalysisPipeline analysisPipeline,
            PasswordEncoder passwordEncoder,
            @Value("${repomind.demo.repo-path:../demo-repository/demo-shop}") String demoRepoPath) {
        return args -> {
            log.info("Checking RepoMind initial database seed...");

            // 1. Ensure demo user exists
            User demoUser = userRepository.findByEmail("demo@repomind.io").orElseGet(() -> {
                User u = new User("Demo Recruiter", "demo@repomind.io", passwordEncoder.encode("demopassword123"));
                u.setGithubId("demo-recruiter");
                User saved = userRepository.save(u);
                log.info("Created demo user: demo@repomind.io / demopassword123");
                return saved;
            });

            // 2. Ensure demo repository exists
            RepositoryEntity demoRepo = repositoryEntityRepository.findFirstByIsDemoTrue().orElseGet(() -> {
                RepositoryEntity r = new RepositoryEntity();
                r.setOwner(demoUser);
                r.setName("demo-shop");
                r.setDescription("Production-grade E-Commerce platform with microservices, JWT auth, and payment processing.");
                r.setGithubUrl("https://github.com/repomind/demo-shop");
                r.setDefaultBranch("master");
                r.setIsDemo(true);
                r.setAnalysisStatus("PENDING");
                r.setLocalPath(demoRepoPath);
                return repositoryEntityRepository.save(r);
            });

            // 3. Pre-analyze demo repository if files exist
            if (!"COMPLETED".equalsIgnoreCase(demoRepo.getAnalysisStatus())) {
                File pathFile = new File(demoRepoPath);
                if (pathFile.exists()) {
                    log.info("Triggering initial analysis on demo repository at {}", demoRepoPath);
                    try {
                        analysisPipeline.runAnalysis(demoRepo.getId(), demoRepoPath);
                    } catch (Exception e) {
                        log.warn("Notice during initial demo repository analysis: {}", e.getMessage());
                    }
                } else {
                    log.info("Demo repository directory not found at {}. Analysis will trigger upon repository import or setup.", demoRepoPath);
                }
            }
        };
    }

    @RestController
    public static class HealthController {
        @GetMapping("/health")
        public Map<String, Object> health() {
            return Map.of(
                    "status", "healthy",
                    "service", "RepoMind Spring Boot 3 Engine",
                    "javaVersion", System.getProperty("java.version"),
                    "architecture", "Java 21 + Spring Boot + React + PostgreSQL"
            );
        }
    }
}

package com.repomind.service;

import com.repomind.analysis.AnalysisPipeline;
import com.repomind.dto.RepositoryDto.*;
import com.repomind.exception.BadRequestException;
import com.repomind.exception.ResourceNotFoundException;
import com.repomind.model.RepositoryEntity;
import com.repomind.model.User;
import com.repomind.repository.RepositoryEntityRepository;
import com.repomind.repository.UserRepository;
import org.eclipse.jgit.api.Git;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Pattern;

@Service
public class RepositoryService {

    private static final Logger log = LoggerFactory.getLogger(RepositoryService.class);

    private final RepositoryEntityRepository repoRepository;
    private final UserRepository userRepository;
    private final AnalysisPipeline analysisPipeline;
    private final String demoRepoPath;

    private static final Pattern GITHUB_URL_PATTERN = Pattern.compile(
            "^(https?://github\\.com/[a-zA-Z0-9_\\-\\.]+\\/[a-zA-Z0-9_\\-\\.]+|git@github\\.com:[a-zA-Z0-9_\\-\\.]+\\/[a-zA-Z0-9_\\-\\.]+\\.git)$"
    );

    public RepositoryService(
            RepositoryEntityRepository repoRepository,
            UserRepository userRepository,
            AnalysisPipeline analysisPipeline,
            @Value("${repomind.demo.repo-path:../demo-repository/demo-shop}") String demoRepoPath) {
        this.repoRepository = repoRepository;
        this.userRepository = userRepository;
        this.analysisPipeline = analysisPipeline;
        this.demoRepoPath = demoRepoPath;
    }

    public List<RepositoryResponse> listRepositories(String userEmail) {
        List<RepositoryEntity> list;
        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user != null) {
                list = repoRepository.findByOwnerIdOrIsDemoTrue(user.getId());
            } else {
                list = repoRepository.findByIsDemoTrue();
            }
        } else {
            list = repoRepository.findByIsDemoTrue();
        }

        return list.stream().map(this::toResponse).toList();
    }

    public RepositoryResponse getRepository(Long id) {
        RepositoryEntity repo = repoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with ID: " + id));
        return toResponse(repo);
    }

    @Transactional
    public RepositoryResponse getDemoRepository() {
        RepositoryEntity demo = repoRepository.findFirstByIsDemoTrue().orElseGet(() -> {
            User demoUser = userRepository.findByEmail("demo@repomind.io").orElse(null);
            RepositoryEntity newDemo = new RepositoryEntity();
            newDemo.setOwner(demoUser);
            newDemo.setName("demo-shop");
            newDemo.setDescription("Production-grade E-Commerce platform with microservices, JWT auth, and payment processing.");
            newDemo.setGithubUrl("https://github.com/repomind/demo-shop");
            newDemo.setDefaultBranch("master");
            newDemo.setIsDemo(true);
            newDemo.setAnalysisStatus("PENDING");
            newDemo.setLocalPath(demoRepoPath);
            newDemo = repoRepository.save(newDemo);

            // Trigger immediate synchronous or async analysis
            try {
                analysisPipeline.runAnalysis(newDemo.getId(), demoRepoPath);
            } catch (Exception e) {
                log.error("Failed to run demo analysis", e);
            }
            return newDemo;
        });

        if ("PENDING".equals(demo.getAnalysisStatus()) || "FAILED".equals(demo.getAnalysisStatus())) {
            try {
                analysisPipeline.runAnalysis(demo.getId(), demo.getLocalPath() != null ? demo.getLocalPath() : demoRepoPath);
            } catch (Exception ignored) {}
        }

        return toResponse(demo);
    }

    @Transactional
    public RepositoryResponse importRepository(RepositoryCreateRequest request, String userEmail) {
        String url = request.githubUrl() != null ? request.githubUrl().trim() : "";
        if (!GITHUB_URL_PATTERN.matcher(url).matches()) {
            throw new BadRequestException("Invalid GitHub repository URL. Expected format: https://github.com/owner/repository");
        }

        String repoName = extractRepoName(url);
        User user = userEmail != null ? userRepository.findByEmail(userEmail).orElse(null) : null;

        RepositoryEntity repo = new RepositoryEntity();
        repo.setOwner(user);
        repo.setGithubUrl(url);
        repo.setName(repoName);
        repo.setDescription("Imported from " + url);
        repo.setDefaultBranch(request.branch() != null ? request.branch() : "main");
        repo.setAnalysisStatus("ANALYZING");
        repo.setIsDemo(false);
        repo = repoRepository.save(repo);

        final Long repoId = repo.getId();
        final String branch = repo.getDefaultBranch();

        // Safe asynchronous clone & analysis
        CompletableFuture.runAsync(() -> {
            try {
                Path tempDir = Files.createTempDirectory("repomind_repo_" + repoId + "_");
                log.info("Cloning {} into temporary directory {}", url, tempDir);

                Git.cloneRepository()
                        .setURI(url)
                        .setDirectory(tempDir.toFile())
                        .setBranch(branch)
                        .setDepth(20)
                        .call()
                        .close();

                analysisPipeline.runAnalysis(repoId, tempDir.toString());
            } catch (Exception e) {
                log.error("Failed to clone and analyze repository {}", url, e);
                repoRepository.findById(repoId).ifPresent(r -> {
                    r.setAnalysisStatus("FAILED");
                    r.setDescription("Analysis failed: " + e.getMessage());
                    repoRepository.save(r);
                });
            }
        });

        return toResponse(repo);
    }

    public void triggerAnalysis(Long repoId) {
        RepositoryEntity repo = repoRepository.findById(repoId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with ID: " + repoId));

        String targetPath = repo.getLocalPath();
        if (targetPath == null || !new File(targetPath).exists()) {
            targetPath = demoRepoPath;
            repo.setLocalPath(targetPath);
            repoRepository.save(repo);
        }

        final String finalPath = targetPath;
        CompletableFuture.runAsync(() -> {
            analysisPipeline.runAnalysis(repoId, finalPath);
        });
    }

    public AnalysisStatusResponse getAnalysisProgress(Long repoId) {
        RepositoryEntity repo = repoRepository.findById(repoId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with ID: " + repoId));

        boolean completed = "COMPLETED".equalsIgnoreCase(repo.getAnalysisStatus());
        boolean analyzing = "ANALYZING".equalsIgnoreCase(repo.getAnalysisStatus());
        boolean failed = "FAILED".equalsIgnoreCase(repo.getAnalysisStatus());

        List<ProgressStepDto> steps = List.of(
                new ProgressStepDto("clone", "Repository cloned & verified", (completed || analyzing) ? "completed" : "pending", null),
                new ProgressStepDto("files", "Source files discovered & language detection", (completed || analyzing) ? "completed" : "pending", null),
                new ProgressStepDto("ast", "JavaParser & AST symbol extraction", completed ? "completed" : (analyzing ? "in_progress" : "pending"), null),
                new ProgressStepDto("deps", "Cross-service dependency graph mapped", completed ? "completed" : "pending", null),
                new ProgressStepDto("git", "JGit commit velocity & code churn analyzed", completed ? "completed" : "pending", null),
                new ProgressStepDto("security", "Static vulnerability audit completed", completed ? "completed" : "pending", null),
                new ProgressStepDto("debt", "Technical debt index calculated", completed ? "completed" : "pending", null),
                new ProgressStepDto("map", "Codebase Map & Architecture generated", completed ? "completed" : "pending", null)
        );

        int progress = completed ? 100 : (analyzing ? 60 : (failed ? 100 : 0));
        return new AnalysisStatusResponse(repoId, repo.getAnalysisStatus(), progress, steps, failed ? repo.getDescription() : null);
    }

    public void deleteRepository(Long id) {
        RepositoryEntity repo = repoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with ID: " + id));
        if (Boolean.TRUE.equals(repo.getIsDemo())) {
            throw new BadRequestException("Default demo repository cannot be deleted.");
        }
        repoRepository.delete(repo);
    }

    private String extractRepoName(String url) {
        String clean = url.replaceAll("\\.git$", "");
        String[] parts = clean.split("/");
        return parts[parts.length - 1];
    }

    private RepositoryResponse toResponse(RepositoryEntity r) {
        return new RepositoryResponse(
                r.getId(),
                r.getOwner() != null ? r.getOwner().getId() : null,
                r.getGithubUrl(),
                r.getName(),
                r.getDescription(),
                r.getDefaultBranch(),
                r.getAnalysisStatus(),
                r.getIsDemo(),
                r.getCreatedAt(),
                r.getUpdatedAt()
        );
    }
}

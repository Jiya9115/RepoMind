package com.repomind.analysis;

import com.repomind.dto.AnalysisDto.*;
import com.repomind.git.JGitService;
import com.repomind.model.*;
import com.repomind.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.*;
import java.util.stream.Stream;

@Service
public class AnalysisPipeline {

    private static final Logger log = LoggerFactory.getLogger(AnalysisPipeline.class);

    private final JavaCodeParser javaCodeParser;
    private final GenericCodeParser genericCodeParser;
    private final DependencyExtractor dependencyExtractor;
    private final ComplexityCalculator complexityCalculator;
    private final SecurityAuditor securityAuditor;
    private final ArchitectureDetector architectureDetector;
    private final CodebaseMapBuilder codebaseMapBuilder;
    private final JGitService jGitService;

    private final RepositoryEntityRepository repositoryEntityRepository;
    private final RepositoryFileRepository fileRepository;
    private final CodeSymbolRepository symbolRepository;
    private final DependencyRepository dependencyRepository;
    private final SecurityFindingRepository securityFindingRepository;
    private final TechnicalDebtMetricRepository debtRepository;
    private final GitCommitRepository gitCommitRepository;
    private final ArchitectureNodeRepository archNodeRepository;
    private final ArchitectureEdgeRepository archEdgeRepository;

    private static final Set<String> IGNORED_DIRS = Set.of(
            ".git", "node_modules", "target", "build", "dist", ".idea", ".vscode",
            ".venv", "venv", "__pycache__", ".next", "bin", "out"
    );

    private static final Map<String, String> EXTENSION_LANGUAGE_MAP = Map.ofEntries(
            Map.entry(".java", "Java"),
            Map.entry(".ts", "TypeScript"),
            Map.entry(".tsx", "TypeScript (React)"),
            Map.entry(".js", "JavaScript"),
            Map.entry(".jsx", "JavaScript (React)"),
            Map.entry(".py", "Python"),
            Map.entry(".sql", "SQL"),
            Map.entry(".html", "HTML"),
            Map.entry(".css", "CSS"),
            Map.entry(".json", "JSON"),
            Map.entry(".md", "Markdown"),
            Map.entry(".xml", "XML"),
            Map.entry(".c", "C"),
            Map.entry(".cpp", "C++")
    );

    public AnalysisPipeline(
            JavaCodeParser javaCodeParser,
            GenericCodeParser genericCodeParser,
            DependencyExtractor dependencyExtractor,
            ComplexityCalculator complexityCalculator,
            SecurityAuditor securityAuditor,
            ArchitectureDetector architectureDetector,
            CodebaseMapBuilder codebaseMapBuilder,
            JGitService jGitService,
            RepositoryEntityRepository repositoryEntityRepository,
            RepositoryFileRepository fileRepository,
            CodeSymbolRepository symbolRepository,
            DependencyRepository dependencyRepository,
            SecurityFindingRepository securityFindingRepository,
            TechnicalDebtMetricRepository debtRepository,
            GitCommitRepository gitCommitRepository,
            ArchitectureNodeRepository archNodeRepository,
            ArchitectureEdgeRepository archEdgeRepository) {
        this.javaCodeParser = javaCodeParser;
        this.genericCodeParser = genericCodeParser;
        this.dependencyExtractor = dependencyExtractor;
        this.complexityCalculator = complexityCalculator;
        this.securityAuditor = securityAuditor;
        this.architectureDetector = architectureDetector;
        this.codebaseMapBuilder = codebaseMapBuilder;
        this.jGitService = jGitService;
        this.repositoryEntityRepository = repositoryEntityRepository;
        this.fileRepository = fileRepository;
        this.symbolRepository = symbolRepository;
        this.dependencyRepository = dependencyRepository;
        this.securityFindingRepository = securityFindingRepository;
        this.debtRepository = debtRepository;
        this.gitCommitRepository = gitCommitRepository;
        this.archNodeRepository = archNodeRepository;
        this.archEdgeRepository = archEdgeRepository;
    }

    @Transactional
    public void runAnalysis(Long repositoryId, String rootPath) {
        RepositoryEntity repo = repositoryEntityRepository.findById(repositoryId)
                .orElseThrow(() -> new IllegalArgumentException("Repository not found with ID: " + repositoryId));

        repo.setAnalysisStatus("ANALYZING");
        repositoryEntityRepository.save(repo);

        Path root = Paths.get(rootPath);
        if (!Files.exists(root)) {
            repo.setAnalysisStatus("FAILED");
            repositoryEntityRepository.save(repo);
            log.error("Analysis failed: Directory does not exist at {}", rootPath);
            return;
        }

        // Clean prior analysis data
        fileRepository.deleteByRepositoryId(repositoryId);
        dependencyRepository.deleteByRepositoryId(repositoryId);
        securityFindingRepository.deleteByRepositoryId(repositoryId);
        debtRepository.deleteByRepositoryId(repositoryId);
        gitCommitRepository.deleteByRepositoryId(repositoryId);
        archNodeRepository.deleteByRepositoryId(repositoryId);
        archEdgeRepository.deleteByRepositoryId(repositoryId);

        List<RepositoryFile> savedFiles = new ArrayList<>();
        Map<String, List<String>> fileImports = new HashMap<>();
        Map<String, Integer> fileComplexities = new HashMap<>();
        List<ComplexityCalculator.FileComplexity> complexityList = new ArrayList<>();
        List<SecurityAuditor.AuditFinding> allFindings = new ArrayList<>();

        // Discover and parse files
        try (Stream<Path> stream = Files.walk(root)) {
            List<Path> filePaths = stream
                    .filter(Files::isRegularFile)
                    .filter(p -> !isIgnored(p, root))
                    .filter(p -> p.toFile().length() <= 500 * 1024) // < 500KB
                    .toList();

            for (Path path : filePaths) {
                String relPath = root.relativize(path).toString().replace('\\', '/');
                String ext = getFileExtension(path.getFileName().toString());
                String language = EXTENSION_LANGUAGE_MAP.getOrDefault(ext, "Plaintext");

                String content;
                try {
                    content = Files.readString(path);
                } catch (Exception e) {
                    continue;
                }

                RepositoryFile repoFile = new RepositoryFile();
                repoFile.setRepository(repo);
                repoFile.setPath(relPath);
                repoFile.setLanguage(language);
                repoFile.setSizeBytes(Files.size(path));
                repoFile.setLineCount(content.split("\r?\n").length);
                repoFile.setContent(content);
                repoFile.setContentHash(computeSha256(content));

                repoFile = fileRepository.save(repoFile);
                savedFiles.add(repoFile);

                // Symbol parsing
                List<CodeSymbol> symbolsToSave = new ArrayList<>();
                List<String> imports = new ArrayList<>();

                if ("Java".equals(language)) {
                    var parseRes = javaCodeParser.parseJava(content);
                    imports.addAll(parseRes.imports());
                    for (var s : parseRes.symbols()) {
                        symbolsToSave.add(new CodeSymbol(repoFile, s.name(), s.type(), s.startLine(), s.endLine()));
                    }
                } else {
                    var parseRes = genericCodeParser.parse(content, language);
                    imports.addAll(parseRes.imports());
                    for (var s : parseRes.symbols()) {
                        symbolsToSave.add(new CodeSymbol(repoFile, s.name(), s.type(), s.startLine(), s.endLine()));
                    }
                }

                symbolRepository.saveAll(symbolsToSave);
                fileImports.put(relPath, imports);

                // Complexity
                var comp = complexityCalculator.analyzeFile(relPath, content);
                fileComplexities.put(relPath, comp.cyclomaticComplexity());
                complexityList.add(comp);

                // Security Audit
                var findings = securityAuditor.auditFile(relPath, content);
                allFindings.addAll(findings);
            }
        } catch (IOException e) {
            log.error("Error walking repository files", e);
        }

        // Dependencies
        List<String> allPaths = savedFiles.stream().map(RepositoryFile::getPath).toList();
        var extractedDeps = dependencyExtractor.resolveDependencies(allPaths, fileImports);
        List<Dependency> depEntities = extractedDeps.stream()
                .map(d -> new Dependency(repo, d.source(), d.target(), d.dependencyType()))
                .toList();
        dependencyRepository.saveAll(depEntities);

        // Security Findings
        List<SecurityFinding> secEntities = allFindings.stream()
                .map(f -> new SecurityFinding(repo, f.file(), f.line(), f.severity(), f.category(), f.description(), f.recommendation()))
                .toList();
        securityFindingRepository.saveAll(secEntities);

        // Technical Debt
        var debtResult = complexityCalculator.calculateDebt(complexityList);
        TechnicalDebtMetric debtMetric = new TechnicalDebtMetric(
                repo,
                debtResult.debtScore(),
                debtResult.remediationHours(),
                debtResult.totalTodos(),
                debtResult.highComplexityModules(),
                debtResult.oversizedFiles(),
                debtResult.explanation()
        );
        debtRepository.save(debtMetric);

        // Git Intelligence
        var gitRes = jGitService.analyzeRepository(rootPath, fileComplexities);
        for (var c : gitRes.recentCommits()) {
            gitCommitRepository.save(new GitCommit(repo, c.hash(), c.author(), c.authorEmail(), c.message(), c.date()));
        }

        // Architecture Detection
        var archRes = architectureDetector.detect(allPaths);
        for (var entry : archRes.tiers().entrySet()) {
            for (var node : entry.getValue()) {
                archNodeRepository.save(new ArchitectureNode(repo, node.id(), node.name(), node.tier(), node.path(), node.description()));
            }
        }
        for (var edge : archRes.edges()) {
            archEdgeRepository.save(new ArchitectureEdge(repo, edge.source(), edge.target(), edge.label()));
        }

        repo.setAnalysisStatus("COMPLETED");
        repositoryEntityRepository.save(repo);
        log.info("Analysis completed successfully for repository '{}' with {} files.", repo.getName(), savedFiles.size());
    }

    private boolean isIgnored(Path path, Path root) {
        Path relative = root.relativize(path);
        for (Path part : relative) {
            if (IGNORED_DIRS.contains(part.toString())) {
                return true;
            }
        }
        return false;
    }

    private String getFileExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot > 0 ? filename.substring(dot).toLowerCase() : "";
    }

    private String computeSha256(String content) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(content.getBytes());
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            return "hash-fallback";
        }
    }
}

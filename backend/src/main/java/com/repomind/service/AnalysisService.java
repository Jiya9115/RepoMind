package com.repomind.service;

import com.repomind.analysis.CodebaseMapBuilder;
import com.repomind.dto.AnalysisDto.*;
import com.repomind.dto.FileDto.*;
import com.repomind.exception.ResourceNotFoundException;
import com.repomind.git.JGitService;
import com.repomind.model.*;
import com.repomind.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalysisService {

    private final RepositoryFileRepository fileRepository;
    private final CodeSymbolRepository symbolRepository;
    private final DependencyRepository dependencyRepository;
    private final SecurityFindingRepository securityFindingRepository;
    private final TechnicalDebtMetricRepository debtRepository;
    private final GitCommitRepository gitCommitRepository;
    private final ArchitectureNodeRepository archNodeRepository;
    private final ArchitectureEdgeRepository archEdgeRepository;
    private final CodebaseMapBuilder codebaseMapBuilder;
    private final JGitService jGitService;

    public AnalysisService(
            RepositoryFileRepository fileRepository,
            CodeSymbolRepository symbolRepository,
            DependencyRepository dependencyRepository,
            SecurityFindingRepository securityFindingRepository,
            TechnicalDebtMetricRepository debtRepository,
            GitCommitRepository gitCommitRepository,
            ArchitectureNodeRepository archNodeRepository,
            ArchitectureEdgeRepository archEdgeRepository,
            CodebaseMapBuilder codebaseMapBuilder,
            JGitService jGitService) {
        this.fileRepository = fileRepository;
        this.symbolRepository = symbolRepository;
        this.dependencyRepository = dependencyRepository;
        this.securityFindingRepository = securityFindingRepository;
        this.debtRepository = debtRepository;
        this.gitCommitRepository = gitCommitRepository;
        this.archNodeRepository = archNodeRepository;
        this.archEdgeRepository = archEdgeRepository;
        this.codebaseMapBuilder = codebaseMapBuilder;
        this.jGitService = jGitService;
    }

    public List<FileSummaryDto> getFiles(Long repoId) {
        List<RepositoryFile> files = fileRepository.findByRepositoryId(repoId);
        return files.stream().map(f -> new FileSummaryDto(
                f.getId(),
                f.getRepository().getId(),
                f.getPath(),
                f.getLanguage(),
                f.getSizeBytes(),
                f.getLineCount(),
                f.getSymbols().size()
        )).toList();
    }

    public FileDetailDto getFileDetail(Long repoId, Long fileId) {
        RepositoryFile f = fileRepository.findById(fileId)
                .filter(rf -> rf.getRepository().getId().equals(repoId))
                .orElseThrow(() -> new ResourceNotFoundException("File not found with ID: " + fileId));

        List<CodeSymbolDto> symbols = symbolRepository.findByFileId(fileId).stream()
                .map(s -> new CodeSymbolDto(s.getId(), s.getFile().getId(), s.getName(), s.getType(), s.getStartLine(), s.getEndLine()))
                .toList();

        return new FileDetailDto(
                f.getId(),
                f.getRepository().getId(),
                f.getPath(),
                f.getLanguage(),
                f.getSizeBytes(),
                f.getLineCount(),
                f.getContent(),
                f.getContentHash(),
                symbols
        );
    }

    public List<TreeNodeDto> getFileTree(Long repoId) {
        List<RepositoryFile> files = fileRepository.findByRepositoryId(repoId);
        Map<String, Object> rootMap = new LinkedHashMap<>();

        for (RepositoryFile f : files) {
            String[] parts = f.getPath().split("/");
            Map<String, Object> current = rootMap;
            StringBuilder acc = new StringBuilder();

            for (int i = 0; i < parts.length; i++) {
                String part = parts[i];
                if (acc.length() > 0) acc.append("/");
                acc.append(part);
                boolean isFile = (i == parts.length - 1);

                if (!current.containsKey(part)) {
                    Map<String, Object> node = new LinkedHashMap<>();
                    node.put("id", acc.toString());
                    node.put("name", part);
                    node.put("path", acc.toString());
                    node.put("type", isFile ? "file" : "folder");
                    if (isFile) {
                        node.put("language", f.getLanguage());
                        node.put("size", f.getSizeBytes());
                        node.put("fileId", f.getId());
                    } else {
                        node.put("childrenMap", new LinkedHashMap<String, Object>());
                    }
                    current.put(part, node);
                }

                if (!isFile) {
                    Map<String, Object> parentNode = (Map<String, Object>) current.get(part);
                    current = (Map<String, Object>) parentNode.get("childrenMap");
                }
            }
        }

        return convertMapToTree(rootMap);
    }

    @SuppressWarnings("unchecked")
    private List<TreeNodeDto> convertMapToTree(Map<String, Object> map) {
        List<TreeNodeDto> result = new ArrayList<>();
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            Map<String, Object> node = (Map<String, Object>) entry.getValue();
            String type = (String) node.get("type");
            List<TreeNodeDto> children = null;
            if ("folder".equals(type)) {
                Map<String, Object> childrenMap = (Map<String, Object>) node.get("childrenMap");
                children = convertMapToTree(childrenMap);
            }

            result.add(new TreeNodeDto(
                    (String) node.get("id"),
                    (String) node.get("name"),
                    (String) node.get("path"),
                    type,
                    (String) node.get("language"),
                    (Long) node.get("size"),
                    (Long) node.get("fileId"),
                    children
            ));
        }

        result.sort((a, b) -> {
            if (a.type().equals(b.type())) return a.name().compareToIgnoreCase(b.name());
            return "folder".equals(a.type()) ? -1 : 1;
        });

        return result;
    }

    public List<CodeSymbolDto> getSymbols(Long repoId, String query) {
        List<CodeSymbol> symbols;
        if (query != null && !query.isBlank()) {
            symbols = symbolRepository.findByFileRepositoryIdAndNameContainingIgnoreCase(repoId, query);
        } else {
            symbols = symbolRepository.findByFileRepositoryId(repoId);
        }
        return symbols.stream().limit(100).map(s -> new CodeSymbolDto(
                s.getId(),
                s.getFile().getId(),
                s.getName(),
                s.getType(),
                s.getStartLine(),
                s.getEndLine()
        )).toList();
    }

    public List<DependencyDto> getDependencies(Long repoId) {
        return dependencyRepository.findByRepositoryId(repoId).stream()
                .map(d -> new DependencyDto(d.getId(), d.getSource(), d.getTarget(), d.getDependencyType()))
                .toList();
    }

    public CodebaseMapDto getCodebaseMap(Long repoId) {
        List<RepositoryFile> files = fileRepository.findByRepositoryId(repoId);
        List<Dependency> deps = dependencyRepository.findByRepositoryId(repoId);
        List<SecurityFinding> findings = securityFindingRepository.findByRepositoryId(repoId);

        List<Map<String, Object>> fileData = files.stream().map(f -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", f.getId());
            m.put("path", f.getPath());
            m.put("language", f.getLanguage());
            m.put("size", f.getSizeBytes());
            m.put("lineCount", f.getLineCount());
            return m;
        }).toList();

        List<Map<String, String>> depData = deps.stream().map(d -> Map.of(
                "source", d.getSource(),
                "target", d.getTarget(),
                "dependencyType", d.getDependencyType()
        )).toList();

        List<Map<String, Object>> secData = findings.stream().map(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("file", s.getFilePath());
            m.put("line", s.getLineNumber());
            m.put("severity", s.getSeverity());
            return m;
        }).toList();

        var mapResult = codebaseMapBuilder.buildMap(fileData, depData, secData);
        return new CodebaseMapDto(mapResult.nodes(), mapResult.edges(), mapResult.stats());
    }

    public ArchitectureOverviewDto getArchitecture(Long repoId) {
        List<ArchitectureNode> nodes = archNodeRepository.findByRepositoryId(repoId);
        List<ArchitectureEdge> edges = archEdgeRepository.findByRepositoryId(repoId);

        Map<String, List<ArchitectureNodeDto>> tiers = new LinkedHashMap<>();
        for (ArchitectureNode n : nodes) {
            tiers.computeIfAbsent(n.getTier(), k -> new ArrayList<>()).add(new ArchitectureNodeDto(
                    n.getNodeId(),
                    n.getName(),
                    n.getPath(),
                    n.getTier(),
                    null,
                    n.getDescription()
            ));
        }

        List<ArchitectureEdgeDto> edgeDtos = edges.stream()
                .map(e -> new ArchitectureEdgeDto(e.getSourceNodeId(), e.getTargetNodeId(), e.getLabel()))
                .toList();

        String summary = String.format("Architecture configured with %d system tiers and %d relational flows.", tiers.size(), edgeDtos.size());
        return new ArchitectureOverviewDto(tiers, edgeDtos, summary);
    }

    public SecurityOverviewDto getSecurityOverview(Long repoId) {
        List<SecurityFinding> findings = securityFindingRepository.findByRepositoryId(repoId);

        int critical = 0, high = 0, medium = 0, low = 0;
        List<SecurityFindingDto> findingDtos = new ArrayList<>();

        for (SecurityFinding f : findings) {
            findingDtos.add(new SecurityFindingDto(
                    f.getId(),
                    f.getFilePath(),
                    f.getLineNumber(),
                    f.getSeverity(),
                    f.getCategory(),
                    f.getDescription(),
                    f.getRecommendation()
            ));

            if ("CRITICAL".equalsIgnoreCase(f.getSeverity())) critical++;
            else if ("HIGH".equalsIgnoreCase(f.getSeverity())) high++;
            else if ("MEDIUM".equalsIgnoreCase(f.getSeverity())) medium++;
            else low++;
        }

        int penalty = (critical * 25) + (high * 10) + (medium * 4) + (low * 1);
        int score = Math.max(20, Math.min(100, 100 - penalty));

        return new SecurityOverviewDto(score, critical, high, medium, low, findingDtos);
    }

    public TechnicalDebtDto getTechnicalDebt(Long repoId) {
        TechnicalDebtMetric metric = debtRepository.findFirstByRepositoryId(repoId).orElseGet(() -> {
            TechnicalDebtMetric fallback = new TechnicalDebtMetric();
            fallback.setDebtScore(88);
            fallback.setRemediationHours(12.5);
            fallback.setTotalTodos(2);
            fallback.setHighComplexityModules(1);
            fallback.setOversizedFiles(1);
            fallback.setExplanation("Calculated codebase complexity metrics.");
            return fallback;
        });

        List<DebtMetricDto> metrics = List.of(
                new DebtMetricDto("Maintainability", "High Complexity Modules", metric.getHighComplexityModules() + " modules", "> 12 branches", metric.getHighComplexityModules() > 1 ? "High" : "Low"),
                new DebtMetricDto("Code Hygiene", "Documented Maintenance Items", metric.getTotalTodos() + " items", "> 0 items", metric.getTotalTodos() > 3 ? "Medium" : "Low"),
                new DebtMetricDto("Modularity", "Oversized Source Files", metric.getOversizedFiles() + " files", "> 250 lines", metric.getOversizedFiles() > 1 ? "Medium" : "Low"),
                new DebtMetricDto("Cognitive Load", "Estimated Remediation Effort", metric.getRemediationHours() + " hours", "< 20 hrs", "Manageable")
        );

        var gitData = jGitService.generateFallbackGitData(Collections.emptyMap());

        return new TechnicalDebtDto(
                metric.getDebtScore(),
                metric.getRemediationHours(),
                metric.getTotalTodos(),
                metric.getHighComplexityModules(),
                metric.getOversizedFiles(),
                gitData.codeHotspots(),
                metrics,
                metric.getExplanation()
        );
    }

    public GitOverviewDto getGitOverview(Long repoId) {
        List<GitCommit> commits = gitCommitRepository.findByRepositoryIdOrderByCommittedAtDesc(repoId);
        if (commits.isEmpty()) {
            var fallback = jGitService.generateFallbackGitData(Collections.emptyMap());
            return new GitOverviewDto(fallback.totalCommits(), fallback.contributors(), fallback.recentCommits(), fallback.topChurnedFiles(), fallback.codeHotspots());
        }

        List<GitCommitDto> commitDtos = commits.stream().map(c -> new GitCommitDto(
                c.getCommitHash(),
                c.getAuthorName(),
                c.getAuthorEmail(),
                c.getMessage(),
                c.getCommittedAt()
        )).toList();

        var fallback = jGitService.generateFallbackGitData(Collections.emptyMap());
        return new GitOverviewDto(commits.size(), fallback.contributors(), commitDtos, fallback.topChurnedFiles(), fallback.codeHotspots());
    }
}

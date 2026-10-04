package com.repomind.model;

import jakarta.persistence.*;

@Entity
@Table(name = "technical_debt_metrics")
public class TechnicalDebtMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private RepositoryEntity repository;

    @Column(name = "debt_score", nullable = false)
    private Integer debtScore;

    @Column(name = "remediation_hours")
    private Double remediationHours = 0.0;

    @Column(name = "total_todos")
    private Integer totalTodos = 0;

    @Column(name = "high_complexity_modules")
    private Integer highComplexityModules = 0;

    @Column(name = "oversized_files")
    private Integer oversizedFiles = 0;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    public TechnicalDebtMetric() {}

    public TechnicalDebtMetric(RepositoryEntity repository, Integer debtScore, Double remediationHours,
                               Integer totalTodos, Integer highComplexityModules, Integer oversizedFiles,
                               String explanation) {
        this.repository = repository;
        this.debtScore = debtScore;
        this.remediationHours = remediationHours;
        this.totalTodos = totalTodos;
        this.highComplexityModules = highComplexityModules;
        this.oversizedFiles = oversizedFiles;
        this.explanation = explanation;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RepositoryEntity getRepository() { return repository; }
    public void setRepository(RepositoryEntity repository) { this.repository = repository; }

    public Integer getDebtScore() { return debtScore; }
    public void setDebtScore(Integer debtScore) { this.debtScore = debtScore; }

    public Double getRemediationHours() { return remediationHours; }
    public void setRemediationHours(Double remediationHours) { this.remediationHours = remediationHours; }

    public Integer getTotalTodos() { return totalTodos; }
    public void setTotalTodos(Integer totalTodos) { this.totalTodos = totalTodos; }

    public Integer getHighComplexityModules() { return highComplexityModules; }
    public void setHighComplexityModules(Integer highComplexityModules) { this.highComplexityModules = highComplexityModules; }

    public Integer getOversizedFiles() { return oversizedFiles; }
    public void setOversizedFiles(Integer oversizedFiles) { this.oversizedFiles = oversizedFiles; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}

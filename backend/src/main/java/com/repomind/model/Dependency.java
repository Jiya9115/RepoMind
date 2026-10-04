package com.repomind.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dependencies")
public class Dependency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private RepositoryEntity repository;

    @Column(nullable = false, length = 512)
    private String source;

    @Column(nullable = false, length = 512)
    private String target;

    @Column(name = "dependency_type", length = 64)
    private String dependencyType = "IMPORT"; // IMPORT, SERVICE_CALL, DATA_MODEL

    public Dependency() {}

    public Dependency(RepositoryEntity repository, String source, String target, String dependencyType) {
        this.repository = repository;
        this.source = source;
        this.target = target;
        this.dependencyType = dependencyType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RepositoryEntity getRepository() { return repository; }
    public void setRepository(RepositoryEntity repository) { this.repository = repository; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getDependencyType() { return dependencyType; }
    public void setDependencyType(String dependencyType) { this.dependencyType = dependencyType; }
}

package com.repomind.model;

import jakarta.persistence.*;

@Entity
@Table(name = "architecture_edges")
public class ArchitectureEdge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private RepositoryEntity repository;

    @Column(name = "source_node_id", nullable = false, length = 512)
    private String sourceNodeId;

    @Column(name = "target_node_id", nullable = false, length = 512)
    private String targetNodeId;

    @Column
    private String label;

    public ArchitectureEdge() {}

    public ArchitectureEdge(RepositoryEntity repository, String sourceNodeId, String targetNodeId, String label) {
        this.repository = repository;
        this.sourceNodeId = sourceNodeId;
        this.targetNodeId = targetNodeId;
        this.label = label;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RepositoryEntity getRepository() { return repository; }
    public void setRepository(RepositoryEntity repository) { this.repository = repository; }

    public String getSourceNodeId() { return sourceNodeId; }
    public void setSourceNodeId(String sourceNodeId) { this.sourceNodeId = sourceNodeId; }

    public String getTargetNodeId() { return targetNodeId; }
    public void setTargetNodeId(String targetNodeId) { this.targetNodeId = targetNodeId; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}

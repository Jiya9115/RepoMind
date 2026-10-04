package com.repomind.model;

import jakarta.persistence.*;

@Entity
@Table(name = "architecture_nodes")
public class ArchitectureNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private RepositoryEntity repository;

    @Column(name = "node_id", nullable = false, length = 512)
    private String nodeId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 64)
    private String tier; // FRONTEND, CONTROLLERS, SERVICES, DATABASE, AUTH, UTILITIES

    @Column(length = 1024)
    private String path;

    @Column(columnDefinition = "TEXT")
    private String description;

    public ArchitectureNode() {}

    public ArchitectureNode(RepositoryEntity repository, String nodeId, String name, String tier, String path, String description) {
        this.repository = repository;
        this.nodeId = nodeId;
        this.name = name;
        this.tier = tier;
        this.path = path;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RepositoryEntity getRepository() { return repository; }
    public void setRepository(RepositoryEntity repository) { this.repository = repository; }

    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

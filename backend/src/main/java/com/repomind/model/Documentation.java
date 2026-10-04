package com.repomind.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "documentation")
public class Documentation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private RepositoryEntity repository;

    @Column(name = "doc_type", nullable = false, length = 64)
    private String docType; // README, ARCHITECTURE, API, ONBOARDING

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String filename;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public Documentation() {}

    public Documentation(RepositoryEntity repository, String docType, String title, String filename, String content) {
        this.repository = repository;
        this.docType = docType;
        this.title = title;
        this.filename = filename;
        this.content = content;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RepositoryEntity getRepository() { return repository; }
    public void setRepository(RepositoryEntity repository) { this.repository = repository; }

    public String getDocType() { return docType; }
    public void setDocType(String docType) { this.docType = docType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

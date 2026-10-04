package com.repomind.model;

import jakarta.persistence.*;

@Entity
@Table(name = "git_commits")
public class GitCommit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private RepositoryEntity repository;

    @Column(name = "commit_hash", nullable = false, length = 64)
    private String commitHash;

    @Column(name = "author_name", nullable = false)
    private String authorName;

    @Column(name = "author_email")
    private String authorEmail;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "committed_at")
    private String committedAt;

    public GitCommit() {}

    public GitCommit(RepositoryEntity repository, String commitHash, String authorName, String authorEmail,
                     String message, String committedAt) {
        this.repository = repository;
        this.commitHash = commitHash;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.message = message;
        this.committedAt = committedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RepositoryEntity getRepository() { return repository; }
    public void setRepository(RepositoryEntity repository) { this.repository = repository; }

    public String getCommitHash() { return commitHash; }
    public void setCommitHash(String commitHash) { this.commitHash = commitHash; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorEmail() { return authorEmail; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCommittedAt() { return committedAt; }
    public void setCommittedAt(String committedAt) { this.committedAt = committedAt; }
}

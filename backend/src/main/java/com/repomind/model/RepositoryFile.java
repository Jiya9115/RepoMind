package com.repomind.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "repository_files")
public class RepositoryFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private RepositoryEntity repository;

    @Column(nullable = false, length = 1024)
    private String path;

    @Column(length = 64)
    private String language;

    @Column(name = "size_bytes")
    private Long sizeBytes = 0L;

    @Column(name = "line_count")
    private Integer lineCount = 0;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "content_hash", length = 128)
    private String contentHash;

    @OneToMany(mappedBy = "file", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CodeSymbol> symbols = new ArrayList<>();

    public RepositoryFile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RepositoryEntity getRepository() { return repository; }
    public void setRepository(RepositoryEntity repository) { this.repository = repository; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(Long sizeBytes) { this.sizeBytes = sizeBytes; }

    public Integer getLineCount() { return lineCount; }
    public void setLineCount(Integer lineCount) { this.lineCount = lineCount; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getContentHash() { return contentHash; }
    public void setContentHash(String contentHash) { this.contentHash = contentHash; }

    public List<CodeSymbol> getSymbols() { return symbols; }
    public void setSymbols(List<CodeSymbol> symbols) { this.symbols = symbols; }
}

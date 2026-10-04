package com.repomind.model;

import jakarta.persistence.*;

@Entity
@Table(name = "code_symbols")
public class CodeSymbol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private RepositoryFile file;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 64)
    private String type; // CLASS, INTERFACE, METHOD, FUNCTION, COMPONENT, FIELD

    @Column(name = "start_line", nullable = false)
    private Integer startLine;

    @Column(name = "end_line", nullable = false)
    private Integer endLine;

    public CodeSymbol() {}

    public CodeSymbol(RepositoryFile file, String name, String type, Integer startLine, Integer endLine) {
        this.file = file;
        this.name = name;
        this.type = type;
        this.startLine = startLine;
        this.endLine = endLine;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RepositoryFile getFile() { return file; }
    public void setFile(RepositoryFile file) { this.file = file; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getStartLine() { return startLine; }
    public void setStartLine(Integer startLine) { this.startLine = startLine; }

    public Integer getEndLine() { return endLine; }
    public void setEndLine(Integer endLine) { this.endLine = endLine; }
}

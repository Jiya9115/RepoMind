package com.repomind.repository;

import com.repomind.model.CodeSymbol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeSymbolRepository extends JpaRepository<CodeSymbol, Long> {
    List<CodeSymbol> findByFileId(Long fileId);
    List<CodeSymbol> findByFileRepositoryId(Long repositoryId);
    List<CodeSymbol> findByFileRepositoryIdAndNameContainingIgnoreCase(Long repositoryId, String name);
}

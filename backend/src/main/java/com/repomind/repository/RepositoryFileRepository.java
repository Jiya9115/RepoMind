package com.repomind.repository;

import com.repomind.model.RepositoryFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepositoryFileRepository extends JpaRepository<RepositoryFile, Long> {
    List<RepositoryFile> findByRepositoryId(Long repositoryId);
    Optional<RepositoryFile> findByRepositoryIdAndPath(Long repositoryId, String path);
    void deleteByRepositoryId(Long repositoryId);
}

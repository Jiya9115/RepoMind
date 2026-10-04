package com.repomind.repository;

import com.repomind.model.Documentation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentationRepository extends JpaRepository<Documentation, Long> {
    List<Documentation> findByRepositoryId(Long repositoryId);
    Optional<Documentation> findByRepositoryIdAndDocType(Long repositoryId, String docType);
    void deleteByRepositoryId(Long repositoryId);
}

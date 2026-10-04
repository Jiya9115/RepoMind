package com.repomind.repository;

import com.repomind.model.ArchitectureEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArchitectureEdgeRepository extends JpaRepository<ArchitectureEdge, Long> {
    List<ArchitectureEdge> findByRepositoryId(Long repositoryId);
    void deleteByRepositoryId(Long repositoryId);
}

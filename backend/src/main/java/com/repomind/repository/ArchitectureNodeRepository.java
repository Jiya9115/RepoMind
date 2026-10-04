package com.repomind.repository;

import com.repomind.model.ArchitectureNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArchitectureNodeRepository extends JpaRepository<ArchitectureNode, Long> {
    List<ArchitectureNode> findByRepositoryId(Long repositoryId);
    void deleteByRepositoryId(Long repositoryId);
}

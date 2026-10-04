package com.repomind.repository;

import com.repomind.model.GitCommit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GitCommitRepository extends JpaRepository<GitCommit, Long> {
    List<GitCommit> findByRepositoryIdOrderByCommittedAtDesc(Long repositoryId);
    void deleteByRepositoryId(Long repositoryId);
}

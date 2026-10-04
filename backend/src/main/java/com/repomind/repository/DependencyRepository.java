package com.repomind.repository;

import com.repomind.model.Dependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DependencyRepository extends JpaRepository<Dependency, Long> {
    List<Dependency> findByRepositoryId(Long repositoryId);
    void deleteByRepositoryId(Long repositoryId);
}

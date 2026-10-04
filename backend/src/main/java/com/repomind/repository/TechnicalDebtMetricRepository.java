package com.repomind.repository;

import com.repomind.model.TechnicalDebtMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TechnicalDebtMetricRepository extends JpaRepository<TechnicalDebtMetric, Long> {
    Optional<TechnicalDebtMetric> findFirstByRepositoryId(Long repositoryId);
    void deleteByRepositoryId(Long repositoryId);
}

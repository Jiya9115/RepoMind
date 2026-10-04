package com.repomind.repository;

import com.repomind.model.RepositoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepositoryEntityRepository extends JpaRepository<RepositoryEntity, Long> {
    Optional<RepositoryEntity> findFirstByIsDemoTrue();
    List<RepositoryEntity> findByOwnerIdOrIsDemoTrue(Long ownerId);
    List<RepositoryEntity> findByIsDemoTrue();
}

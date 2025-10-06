package com.example.labsampletracker.repository;

import com.example.labsampletracker.model.Sample;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SampleRepository extends JpaRepository<Sample, String> {
    long countByCreatedBy(String createdBy);
    List<Sample> findByStatusAndCreatedBy(String status, String createdBy);
    List<Sample> findByCreatedBy(String createdBy);
    Page<Sample> findByStatus(String status, Pageable pageable);
}
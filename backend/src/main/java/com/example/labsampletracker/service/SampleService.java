package com.example.labsampletracker.service;

import com.example.labsampletracker.model.Sample;
import com.example.labsampletracker.repository.SampleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SampleService {

    private final SampleRepository repo;

    public SampleService(SampleRepository repo) {
        this.repo = repo;
    }

    // Get all samples (not paginated)
    public List<Sample> getAllByUser(String username) {
        return repo.findByCreatedBy(username);
    }

    public List<Sample> getByStatusAndUser(String status, String username) {
        return repo.findByStatusAndCreatedBy(status, username);
    }

    //Gets by status with pagination
    public Page<Sample> getByStatusPaged(String status, Pageable pageable) {
        return repo.findByStatus(status, pageable);
    }

    // Gets single sample by ID
    public Optional<Sample> get(String id) {
        return repo.findById(id);
    }

    // Creates new sample
    public Sample create(Sample s) {
        return repo.save(s);
    }

    // Updates existing sample
    public Sample update(String id, Sample s) {
        s.setSampleId(id);
        return repo.save(s);
    }

    // Deletes sample
    public void delete(String id) {
        repo.deleteById(id);
    }
    public Sample updateStatus(String id, String newStatus) {
        Optional<Sample> optSample = repo.findById(id);
        if (optSample.isPresent()) {
            Sample s = optSample.get();
            s.setStatus(newStatus);
            return repo.save(s);
        }
        throw new RuntimeException("Sample not found with id: " + id);
    }
}
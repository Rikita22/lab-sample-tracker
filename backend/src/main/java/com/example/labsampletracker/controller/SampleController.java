package com.example.labsampletracker.controller;

import com.example.labsampletracker.model.Sample;
import com.example.labsampletracker.repository.SampleRepository;
import com.example.labsampletracker.service.SampleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/samples")
@CrossOrigin(origins = "*") // allows React frontend to connect

public class SampleController {

    private final SampleService service;
    private final SampleRepository repo;

    public SampleController(SampleService service, SampleRepository repo) {

        this.service = service;
        this.repo = repo;
    }

    @GetMapping
    public List<Sample> list(@RequestParam(value = "status", required = false) String status,
                             Authentication authentication) {
        String username = authentication.getName();
        if (status != null && !status.isEmpty())
            return service.getByStatusAndUser(status, username);
        return service.getAllByUser(username);
    }

    // Gets paginated samples by status
    // Example: GET /api/samples/status/Created?page=0&size=5&sort=createdDate,desc
    @GetMapping("/status/{status}")

    public Page<Sample> listByStatus(@PathVariable String status, Pageable pageable) {
        return service.getByStatusPaged(status, pageable);

    }

    // Gets single sample by ID
    @GetMapping("/{id}")

    public ResponseEntity<Sample> get(@PathVariable String id) {

        return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());

    }

    //Creates new sample
    @PostMapping

    public ResponseEntity<Sample> create(@RequestBody Sample s, Authentication authentication) {
        String username = authentication.getName();
        s.setCreatedBy(username);
        s.setStatus("Created");
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        long userCount = repo.countByCreatedBy(username);
        String newId = "S-"+ datePart + "-" + String.format("%06d", userCount+1);
        s.setSampleId(newId);
        return ResponseEntity.ok(service.create(s));

    }

    //Updates sample
    @PutMapping("/{id}")

    public ResponseEntity<Sample> update(@PathVariable String id, @RequestBody Sample s) {

        if (service.get(id).isEmpty()) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(service.update(id, s));

    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Sample> updateStatus(@PathVariable String id, @RequestParam String status) {
        try {
            Sample updated = service.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //Deletes sample

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {

        service.delete(id);
        return ResponseEntity.noContent().build();

    }

}


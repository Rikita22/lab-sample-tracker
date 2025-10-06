package com.example.labsampletracker.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "samples")
public class Sample {

    @Id
    @Column(name = "sample_id", nullable = false, length = 50)
    private String sampleId;

    @Column(length = 255)
    private String description;

    @Column(name = "requested_by", length = 100)
    private String requestedBy;

    @Column(length = 50)
    private String status;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name ="created_by")
    private String createdBy;

    // ✅ Auto-set createdDate before insert
    @PrePersist
    public void prePersist() {
        if (createdDate == null) {
            createdDate = LocalDateTime.now();
        }
    }

    // ✅ Constructors
    public Sample() {}

    public Sample(String sampleId, String description, String requestedBy, String status) {
        this.sampleId = sampleId;
        this.description = description;
        this.requestedBy = requestedBy;
        this.status = status;
    }

}
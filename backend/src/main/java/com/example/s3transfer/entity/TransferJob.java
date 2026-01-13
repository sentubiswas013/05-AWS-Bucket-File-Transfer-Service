package com.example.s3transfer.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "transfer_jobs")
@Data
public class TransferJob {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String sourceBucket;
    
    @Column(nullable = false)
    private String destinationBucket;
    
    @Column(nullable = false)
    private String fileKey;
    
    @Column(nullable = false)
    private String status;
    
    @Column(length = 1000)
    private String errorMessage;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime completedAt;
}
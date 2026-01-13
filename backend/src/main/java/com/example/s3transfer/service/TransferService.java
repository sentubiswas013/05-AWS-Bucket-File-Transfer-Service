package com.example.s3transfer.service;

import com.example.s3transfer.dto.TransferRequest;
import com.example.s3transfer.entity.TransferJob;
import com.example.s3transfer.repository.TransferJobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransferService {

    private final TransferJobRepository repo;
    private final IS3Service s3Service;

    public UUID startTransfer(TransferRequest req) {
        // Validate input
        if (req.getSourceBucket() == null || req.getDestinationBucket() == null || req.getFileKey() == null) {
            throw new IllegalArgumentException("Source bucket, destination bucket, and file key are required");
        }

        TransferJob job = new TransferJob();
        job.setSourceBucket(req.getSourceBucket());
        job.setDestinationBucket(req.getDestinationBucket());
        job.setFileKey(req.getFileKey());
        job.setStatus("IN_PROGRESS");
        job.setCreatedAt(LocalDateTime.now());
        job = repo.save(job);

        // Start async transfer
        performTransferAsync(job);
        return job.getId();
    }

    @Async
    public void performTransferAsync(TransferJob job) {
        try {
            log.info("Starting transfer: {}/{} -> {}/{}", 
                    job.getSourceBucket(), job.getFileKey(), 
                    job.getDestinationBucket(), job.getFileKey());
            
            s3Service.copyFile(job.getSourceBucket(), job.getDestinationBucket(), job.getFileKey());
            
            job.setStatus("COMPLETED");
            job.setCompletedAt(LocalDateTime.now());
            log.info("Transfer completed: {}", job.getId());
        } catch (Exception e) {
            log.error("Transfer failed: {}", job.getId(), e);
            job.setStatus("FAILED");
            job.setErrorMessage(e.getMessage());
            job.setCompletedAt(LocalDateTime.now());
        }
        repo.save(job);
    }

    public String getTransferStatus(UUID jobId) {
        TransferJob job = repo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Transfer job not found: " + jobId));
        return job.getStatus();
    }
}
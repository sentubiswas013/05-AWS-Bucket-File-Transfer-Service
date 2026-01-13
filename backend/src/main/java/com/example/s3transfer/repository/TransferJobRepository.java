package com.example.s3transfer.repository;

import com.example.s3transfer.entity.TransferJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TransferJobRepository extends JpaRepository<TransferJob, UUID> {
}
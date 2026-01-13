package com.example.s3transfer.repository;

import com.example.s3transfer.entity.AwsCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AwsCredentialRepository extends JpaRepository<AwsCredential, Long> {
}


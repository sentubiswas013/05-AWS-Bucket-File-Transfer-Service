package com.example.s3transfer.service;

import com.example.s3transfer.entity.AwsCredential;
import com.example.s3transfer.repository.AwsCredentialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.InputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Profile("!mock")
public class S3Service implements IS3Service {

    private final EncryptionService encryptionService;
    private final AwsCredentialRepository repo;

    private S3Client s3() {
        AwsCredential c = repo.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No AWS credentials configured"));
        
        return S3Client.builder()
                .region(Region.of(c.getRegion()))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(
                                        encryptionService.decrypt(c.getAccessKeyEncrypted()),
                                        encryptionService.decrypt(c.getSecretKeyEncrypted())
                                )
                        )
                ).build();
    }

    public List<String> listFiles(String bucket) {
        try {
            return s3().listObjectsV2(b -> b.bucket(bucket))
                    .contents().stream()
                    .map(S3Object::key)
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to list files in bucket: {}", bucket, e);
            throw new RuntimeException("Failed to list files: " + e.getMessage());
        }
    }

    public void uploadFile(String bucket, String key, InputStream inputStream, long contentLength) {
        try {
            s3().putObject(
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .contentLength(contentLength)
                            .build(),
                    RequestBody.fromInputStream(inputStream, contentLength)
            );
            log.info("File uploaded successfully: {}/{}", bucket, key);
        } catch (Exception e) {
            log.error("Failed to upload file: {}/{}", bucket, key, e);
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    public ResponseInputStream<GetObjectResponse> downloadFile(String bucket, String key) {
        try {
            return s3().getObject(GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build());
        } catch (Exception e) {
            log.error("Failed to download file: {}/{}", bucket, key, e);
            throw new RuntimeException("Failed to download file: " + e.getMessage());
        }
    }

    public void copyFile(String sourceBucket, String destinationBucket, String key) {
        try {
            s3().copyObject(CopyObjectRequest.builder()
                    .sourceBucket(sourceBucket)
                    .sourceKey(key)
                    .destinationBucket(destinationBucket)
                    .destinationKey(key)
                    .build());
            log.info("File copied successfully: {}/{} -> {}/{}", sourceBucket, key, destinationBucket, key);
        } catch (Exception e) {
            log.error("Failed to copy file: {}/{} -> {}/{}", sourceBucket, key, destinationBucket, key, e);
            throw new RuntimeException("Failed to copy file: " + e.getMessage());
        }
    }

    public boolean bucketExists(String bucket) {
        try {
            s3().headBucket(HeadBucketRequest.builder().bucket(bucket).build());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void createBucket(String bucket) {
        try {
            s3().createBucket(CreateBucketRequest.builder().bucket(bucket).build());
            log.info("Bucket created successfully: {}", bucket);
        } catch (Exception e) {
            log.error("Failed to create bucket: {}", bucket, e);
            throw new RuntimeException("Failed to create bucket: " + e.getMessage());
        }
    }
}
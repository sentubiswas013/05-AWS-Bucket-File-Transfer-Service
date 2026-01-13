package com.example.s3transfer.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.http.AbortableInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Profile("mock")
@Slf4j
public class MockS3Service implements IS3Service {

    private final ConcurrentHashMap<String, ConcurrentHashMap<String, byte[]>> mockStorage = new ConcurrentHashMap<>();
    private final Path mockStoragePath = Paths.get("mock-s3-storage");

    public MockS3Service() {
        try {
            Files.createDirectories(mockStoragePath);
        } catch (IOException e) {
            log.error("Failed to create mock storage directory", e);
        }
    }

    public List<String> listFiles(String bucket) {
        return mockStorage.getOrDefault(bucket, new ConcurrentHashMap<>())
                .keySet().stream().collect(Collectors.toList());
    }

    public void uploadFile(String bucket, String key, InputStream inputStream, long contentLength) {
        try {
            byte[] data = inputStream.readAllBytes();
            mockStorage.computeIfAbsent(bucket, k -> new ConcurrentHashMap<>()).put(key, data);
            
            Path bucketPath = mockStoragePath.resolve(bucket);
            Files.createDirectories(bucketPath);
            Files.write(bucketPath.resolve(key), data);
            
            log.info("Mock: File uploaded successfully: {}/{}", bucket, key);
        } catch (Exception e) {
            log.error("Mock: Failed to upload file: {}/{}", bucket, key, e);
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    public ResponseInputStream<GetObjectResponse> downloadFile(String bucket, String key) {
        try {
            byte[] data = mockStorage.getOrDefault(bucket, new ConcurrentHashMap<>()).get(key);
            if (data == null) {
                throw new RuntimeException("File not found: " + key);
            }
            
            GetObjectResponse response = GetObjectResponse.builder()
                    .contentLength((long) data.length)
                    .build();
            
            AbortableInputStream abortableStream = AbortableInputStream.create(new ByteArrayInputStream(data));
            return new ResponseInputStream<>(response, abortableStream);
        } catch (Exception e) {
            log.error("Mock: Failed to download file: {}/{}", bucket, key, e);
            throw new RuntimeException("Failed to download file: " + e.getMessage());
        }
    }

    public void copyFile(String sourceBucket, String destinationBucket, String key) {
        try {
            byte[] data = mockStorage.getOrDefault(sourceBucket, new ConcurrentHashMap<>()).get(key);
            if (data == null) {
                throw new RuntimeException("Source file not found: " + key);
            }
            
            mockStorage.computeIfAbsent(destinationBucket, k -> new ConcurrentHashMap<>()).put(key, data);
            log.info("Mock: File copied successfully: {}/{} -> {}/{}", sourceBucket, key, destinationBucket, key);
        } catch (Exception e) {
            log.error("Mock: Failed to copy file: {}/{} -> {}/{}", sourceBucket, key, destinationBucket, key, e);
            throw new RuntimeException("Failed to copy file: " + e.getMessage());
        }
    }

    public boolean bucketExists(String bucket) {
        return true; // Always return true for mock
    }

    public void createBucket(String bucket) {
        mockStorage.computeIfAbsent(bucket, k -> new ConcurrentHashMap<>());
        log.info("Mock: Bucket created successfully: {}", bucket);
    }
}
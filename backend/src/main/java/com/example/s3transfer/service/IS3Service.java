package com.example.s3transfer.service;

import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.io.InputStream;
import java.util.List;

public interface IS3Service {
    List<String> listFiles(String bucket);
    void uploadFile(String bucket, String key, InputStream inputStream, long contentLength);
    ResponseInputStream<GetObjectResponse> downloadFile(String bucket, String key);
    void copyFile(String sourceBucket, String destinationBucket, String key);
    boolean bucketExists(String bucket);
    void createBucket(String bucket);
}
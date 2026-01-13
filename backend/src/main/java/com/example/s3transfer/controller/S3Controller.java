package com.example.s3transfer.controller;

import com.example.s3transfer.service.IS3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.Parameter;

import java.util.List;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
@Tag(name = "S3 Operations", description = "S3 bucket file operations")
public class S3Controller {

    private final IS3Service s3Service;

    @GetMapping("/{bucket}/files")
    @Operation(summary = "List Files", description = "List all files in an S3 bucket")
    @ApiResponse(responseCode = "200", description = "Files listed successfully")
    @ApiResponse(responseCode = "400", description = "Bucket does not exist")
    public ResponseEntity<?> listFiles(
            @Parameter(description = "S3 bucket name", example = "my-bucket")
            @PathVariable String bucket) {
        try {
            if (!s3Service.bucketExists(bucket)) {
                return ResponseEntity.badRequest().body("Bucket does not exist: " + bucket);
            }
            return ResponseEntity.ok(s3Service.listFiles(bucket));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("No AWS credentials")) {
                return ResponseEntity.badRequest().body("No AWS credentials configured. Please configure credentials in Admin Panel first.");
            }
            return ResponseEntity.badRequest().body("Failed to list files: " + e.getMessage());
        }
    }

    @PostMapping("/{bucket}/upload")
    @Operation(summary = "Upload File", description = "Upload a file to S3 bucket")
    @ApiResponse(responseCode = "200", description = "File uploaded successfully")
    @ApiResponse(responseCode = "400", description = "Upload failed")
    public ResponseEntity<String> uploadFile(
            @Parameter(description = "S3 bucket name", example = "my-bucket")
            @PathVariable String bucket,
            @Parameter(description = "File to upload")
            @RequestParam("file") MultipartFile file,
            @Parameter(description = "Custom file key/name", example = "documents/report.pdf")
            @RequestParam(value = "key", required = false) String key) {
        try {
            if (!s3Service.bucketExists(bucket)) {
                s3Service.createBucket(bucket);
            }
            String fileKey = key != null ? key : file.getOriginalFilename();
            s3Service.uploadFile(bucket, fileKey, file.getInputStream(), file.getSize());
            return ResponseEntity.ok("File uploaded successfully: " + fileKey);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("No AWS credentials")) {
                return ResponseEntity.badRequest().body("No AWS credentials configured. Please configure credentials in Admin Panel first.");
            }
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/{bucket}/download/{key}")
    @Operation(summary = "Download File", description = "Download a file from S3 bucket")
    @ApiResponse(responseCode = "200", description = "File downloaded successfully")
    @ApiResponse(responseCode = "400", description = "Download failed")
    public ResponseEntity<InputStreamResource> downloadFile(
            @Parameter(description = "S3 bucket name", example = "my-bucket")
            @PathVariable String bucket,
            @Parameter(description = "File key/path", example = "documents/report.pdf")
            @PathVariable String key) {
        try {
            ResponseInputStream<GetObjectResponse> s3Object = s3Service.downloadFile(bucket, key);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + key + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new InputStreamResource(s3Object));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
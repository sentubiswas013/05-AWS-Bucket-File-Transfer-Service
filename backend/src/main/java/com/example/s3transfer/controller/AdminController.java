package com.example.s3transfer.controller;

import com.example.s3transfer.dto.AwsCredentialDTO;
import com.example.s3transfer.entity.AwsCredential;
import com.example.s3transfer.repository.AwsCredentialRepository;
import com.example.s3transfer.service.EncryptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "AWS Credentials Management")
public class AdminController {

    private final AwsCredentialRepository repo;
    private final EncryptionService enc;

    @PostMapping("/aws")
    @Operation(summary = "Save AWS Credentials", description = "Store encrypted AWS credentials for S3 operations")
    @ApiResponse(responseCode = "200", description = "Credentials saved successfully")
    @ApiResponse(responseCode = "400", description = "Failed to save credentials")
    public ResponseEntity<String> saveCredentials(@RequestBody AwsCredentialDTO dto) {
        try {
            AwsCredential c = new AwsCredential();
            c.setAccountName(dto.getAccountName());
            c.setRegion(dto.getRegion());
            c.setAccessKeyEncrypted(enc.encrypt(dto.getAccessKey()));
            c.setSecretKeyEncrypted(enc.encrypt(dto.getSecretKey()));
            repo.save(c);
            
            return ResponseEntity.ok("AWS credentials saved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to save credentials: " + e.getMessage());
        }
    }

    @GetMapping("/aws")
    @Operation(summary = "Get AWS Credentials", description = "Retrieve all stored AWS credentials (keys are masked)")
    @ApiResponse(responseCode = "200", description = "Credentials retrieved successfully")
    public ResponseEntity<List<AwsCredential>> getCredentials() {
        try {
            List<AwsCredential> credentials = repo.findAll();
            return ResponseEntity.ok(credentials);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
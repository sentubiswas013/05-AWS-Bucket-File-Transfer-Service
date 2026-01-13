package com.example.s3transfer.controller;

import com.example.s3transfer.dto.TransferRequest;
import com.example.s3transfer.service.TransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.Parameter;

import java.util.UUID;

@RestController
@RequestMapping("/api/transfer")
@RequiredArgsConstructor
@Tag(name = "File Transfer", description = "S3 file transfer operations")
public class TransferController {

    private final TransferService service;

    @PostMapping
    @Operation(summary = "Start File Transfer", description = "Initiate an asynchronous file transfer between S3 buckets")
    @ApiResponse(responseCode = "200", description = "Transfer job created successfully")
    @ApiResponse(responseCode = "400", description = "Transfer failed")
    public ResponseEntity<?> transfer(@RequestBody TransferRequest req) {
        try {
            UUID jobId = service.startTransfer(req);
            return ResponseEntity.ok(jobId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Transfer failed: " + e.getMessage());
        }
    }

    @GetMapping("/{jobId}/status")
    @Operation(summary = "Get Transfer Status", description = "Check the status of a file transfer job")
    @ApiResponse(responseCode = "200", description = "Status retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Transfer job not found")
    public ResponseEntity<String> getStatus(
            @Parameter(description = "Transfer job ID", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
            @PathVariable UUID jobId) {
        try {
            String status = service.getTransferStatus(jobId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
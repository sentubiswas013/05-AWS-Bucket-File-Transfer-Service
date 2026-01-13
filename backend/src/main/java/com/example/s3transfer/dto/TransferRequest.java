package com.example.s3transfer.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "File Transfer Request")
public class TransferRequest {
    @Schema(description = "Source S3 bucket name", example = "my-source-bucket", required = true)
    private String sourceBucket;
    
    @Schema(description = "Destination S3 bucket name", example = "my-destination-bucket", required = true)
    private String destinationBucket;
    
    @Schema(description = "File key/path in S3", example = "documents/report.pdf", required = true)
    private String fileKey;
}
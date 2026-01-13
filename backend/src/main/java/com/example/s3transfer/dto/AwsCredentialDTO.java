package com.example.s3transfer.dto;

import lombok.Data;
import java.util.UUID;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "AWS Credential Data Transfer Object")
public class AwsCredentialDTO {
    @Schema(description = "Unique identifier", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6", hidden = true)
    private UUID id;
    
    @Schema(description = "AWS Account Name", example = "My Production Account", required = true)
    private String accountName;
    
    @Schema(description = "AWS Access Key ID", example = "AKIAIOSFODNN7EXAMPLE", required = true)
    private String accessKey;
    
    @Schema(description = "AWS Secret Access Key", example = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY", required = true)
    private String secretKey;
    
    @Schema(description = "AWS Region", example = "us-east-1", required = true)
    private String region;
}
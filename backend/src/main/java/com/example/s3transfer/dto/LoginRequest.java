package com.example.s3transfer.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "User Login Request")
public class LoginRequest {
    @Schema(description = "Username", example = "admin", required = true)
    private String username;
    
    @Schema(description = "Password", example = "password123", required = true)
    private String password;
}
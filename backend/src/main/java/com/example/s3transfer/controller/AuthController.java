package com.example.s3transfer.controller;

import com.example.s3transfer.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User authentication operations")
public class AuthController {

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticate user and return JWT token")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        // Simple authentication - in production, use proper authentication
        if ("admin".equals(request.getUsername()) && "password".equals(request.getPassword())) {
            return ResponseEntity.ok(Map.of("token", "JWT_TOKEN_" + System.currentTimeMillis()));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}
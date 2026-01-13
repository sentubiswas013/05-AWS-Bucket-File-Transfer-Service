package com.example.s3transfer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @GetMapping("/")
    public String hello() {
        return "AWS Bucket File Transfer Service is running!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
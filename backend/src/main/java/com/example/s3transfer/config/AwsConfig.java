package com.example.s3transfer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsConfig {

//    @Bean
    public S3Client s3Client() {
        // In a real app, load credentials from secure storage or environment
        AwsBasicCredentials creds = AwsBasicCredentials.create("accessKey", "secretKey");
        return S3Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(StaticCredentialsProvider.create(creds))
                .build();
    }
}


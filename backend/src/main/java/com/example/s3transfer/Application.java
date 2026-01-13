package com.example.s3transfer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.example.s3transfer.entity")
@EnableJpaRepositories("com.example.s3transfer.repository")
public class Application {
    public static void main(String[] args) {

        SpringApplication.run(Application.class, args);
    }
}
package com.example.s3transfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.sql.DataSource;
import java.sql.Connection;

@RestController
public class DatabaseTestController {
    
    @Autowired
    private DataSource dataSource;
    
    @GetMapping("/api/test/db")
    public String testDatabase() {
        try (Connection connection = dataSource.getConnection()) {
            return "Database connected successfully! URL: " + connection.getMetaData().getURL();
        } catch (Exception e) {
            return "Database connection failed: " + e.getMessage();
        }
    }
}
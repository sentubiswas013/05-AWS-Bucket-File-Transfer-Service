package com.example.s3transfer.entity;

import javax.persistence.*;
import lombok.Data;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "aws_credentials")
@Data
public class AwsCredential {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String accountName;
    
    @Column(nullable = false)
    private String accessKeyEncrypted;
    
    @Column(nullable = false)
    private String secretKeyEncrypted;
    
    @Column(nullable = false)
    private String region;
}
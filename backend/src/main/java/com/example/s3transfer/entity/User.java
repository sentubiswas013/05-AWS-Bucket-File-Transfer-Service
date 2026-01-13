package com.example.s3transfer.entity;

import javax.persistence.*;
import lombok.Data;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(unique = true)
    private String username;

    private String password;
    private String role;
}
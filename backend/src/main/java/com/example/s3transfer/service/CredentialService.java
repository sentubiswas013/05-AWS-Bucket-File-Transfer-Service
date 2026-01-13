package com.example.s3transfer.service;

import com.example.s3transfer.dto.AwsCredentialDTO;
import com.example.s3transfer.entity.AwsCredential;
import com.example.s3transfer.repository.AwsCredentialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CredentialService {

    private final AwsCredentialRepository repository;
    private final EncryptionService encryptionService;

    @Transactional
    public AwsCredential save(AwsCredentialDTO dto) {
        AwsCredential c = new AwsCredential();
        c.setAccountName(dto.getAccountName());
        c.setRegion(dto.getRegion());
        c.setAccessKeyEncrypted(encryptionService.encrypt(dto.getAccessKey()));
        c.setSecretKeyEncrypted(encryptionService.encrypt(dto.getSecretKey()));
        return repository.save(c);
    }
}
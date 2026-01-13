package com.example.s3transfer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class EncryptionService {

    @Value("${app.encryption.key:mySecretKey123456}")
    private String secretKey;

    private static final String ALGORITHM = "AES";

    public String encrypt(String data) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    public String decrypt(String encrypted) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decoded = Base64.getDecoder().decode(encrypted);
            byte[] decrypted = cipher.doFinal(decoded);
            return new String(decrypted);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }
}
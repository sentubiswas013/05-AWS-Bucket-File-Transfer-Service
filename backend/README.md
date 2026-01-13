# AWS Bucket File Transfer Service

A Spring Boot service for seamless file transfers between AWS S3 buckets with secure credential management.

## Features

- **File Operations**: List, upload, download files from S3 buckets
- **File Transfer**: Copy files between different S3 buckets
- **Secure Credentials**: Encrypted storage of AWS credentials
- **Admin Panel**: Manage AWS credentials securely
- **Async Processing**: Non-blocking file transfers
- **Status Tracking**: Monitor transfer job progress

Swagger endpoints (after the app runs)
OpenAPI JSON: http://localhost:8081/v3/api-docs
Swagger UI: http://localhost:8081/swagger-ui.html or /swagger-ui/index.html

## Setup

1. **Prerequisites**:
   - Java 17+
   - Maven 3.6+
   - AWS Account with S3 access

2. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

3. **Access H2 Console** (development):
   - URL: http://localhost:8081/h2-console
   - JDBC URL: jdbc:h2:mem:testdb
   - Username: sa
   - Password: (empty)

## API Endpoints

### Admin - AWS Credentials Management

#### Save AWS Credentials
```http
POST /api/admin/aws
Content-Type: application/json

{
  "accountName": "My AWS Account",
  "accessKey": "AKIA...",
  "secretKey": "...",
  "region": "us-east-1"
}
```

#### Get AWS Credentials (masked)
```http
GET /api/admin/aws
```

#### Delete AWS Credentials
```http
DELETE /api/admin/aws/{id}
```

### S3 Operations

#### List Files in Bucket
```http
GET /api/s3/{bucketName}/files
```

#### Upload File
```http
POST /api/s3/{bucketName}/upload
Content-Type: multipart/form-data

file: [file to upload]
key: [optional custom key name]
```

#### Download File
```http
GET /api/s3/{bucketName}/download/{fileKey}
```

### File Transfer

#### Start Transfer
```http
POST /api/transfer
Content-Type: application/json

{
  "sourceBucket": "source-bucket-name",
  "destinationBucket": "dest-bucket-name",
  "fileKey": "path/to/file.txt"
}
```

#### Check Transfer Status
```http
GET /api/transfer/{jobId}/status
```

## Security Features

- AES encryption for AWS credentials
- Input validation for all endpoints
- Error handling with proper HTTP status codes
- Secure credential storage

## Configuration

Key application properties:
- `app.encryption.key`: Encryption key for credentials
- `spring.servlet.multipart.max-file-size`: Max upload file size
- `spring.task.execution.pool.*`: Async processing configuration

## Development Notes

- Uses H2 in-memory database for development
- Switch to PostgreSQL for production
- Credentials are encrypted using AES
- File transfers are processed asynchronously
- Comprehensive error handling and logging
package com.collabit.pitch.service;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.access-key:}")
    private String accessKey;

    @Value("${aws.secret-key:}")
    private String secretKey;

    @Value("${aws.region:us-east-1}")
    private String region;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String generateUploadUrl(String fileName) {

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key("pitch-images/" + fileName)
                .contentType("image/jpeg")
                .build();

        AwsBasicCredentials credentials = AwsBasicCredentials.create(
            accessKey == null ? "" : accessKey,
            secretKey == null ? "" : secretKey
        );

        try (S3Presigner presigner = S3Presigner.builder()
            .region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(credentials))
            .build()) {

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .putObjectRequest(objectRequest)
                    .signatureDuration(Duration.ofMinutes(10))
                    .build();

            PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);

            return presignedRequest.url().toString();
        }
    }
}

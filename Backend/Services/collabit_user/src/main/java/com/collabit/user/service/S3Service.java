package com.collabit.user.service;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
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

    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            System.out.println("Configuring S3 CORS for bucket: " + bucketName);

            software.amazon.awssdk.services.s3.model.CORSRule corsRule = software.amazon.awssdk.services.s3.model.CORSRule
                    .builder()
                    .allowedHeaders("*")
                    .allowedMethods("GET", "PUT", "POST", "DELETE", "HEAD")
                    .allowedOrigins("*")
                    .exposeHeaders("ETag")
                    .maxAgeSeconds(3000)
                    .build();

            software.amazon.awssdk.services.s3.model.CORSConfiguration configuration = software.amazon.awssdk.services.s3.model.CORSConfiguration
                    .builder()
                    .corsRules(java.util.Collections.singletonList(corsRule))
                    .build();

            software.amazon.awssdk.services.s3.model.PutBucketCorsRequest request = software.amazon.awssdk.services.s3.model.PutBucketCorsRequest
                    .builder()
                    .bucket(bucketName)
                    .corsConfiguration(configuration)
                    .build();

            s3Client.putBucketCors(request);
            System.out.println("S3 Bucket CORS configured successfully.");
        } catch (Exception e) {
            System.err.println("Failed to configure S3 CORS: " + e.getMessage());
        }
    }

    public String generateUploadUrl(String fileName, String contentType) {

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key("profile-images/" + fileName)
                .contentType(contentType)
                // .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        AwsBasicCredentials credentials = AwsBasicCredentials.create(
                accessKey == null ? "" : accessKey,
                secretKey == null ? "" : secretKey);

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

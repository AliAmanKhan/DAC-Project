@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String generateUploadUrl(String fileName) {

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key("profile-images/" + fileName)
                .contentType("image/jpeg")
                .build();

        try (S3Presigner presigner = S3Presigner.create()) {

            PutObjectPresignRequest presignRequest =
                    PutObjectPresignRequest.builder()
                            .putObjectRequest(objectRequest)
                            .signatureDuration(Duration.ofMinutes(10))
                            .build();

            PresignedPutObjectRequest presignedRequest =
                    presigner.presignPutObject(presignRequest);

            return presignedRequest.url().toString();
        }
    }
}

# AWS S3 Integration Setup Guide

## Overview
AWS S3 has been integrated with both frontend and backend services for handling image uploads for user profiles and pitches.

## Architecture

### Backend Configuration

#### User Service (Port 8080)
- **S3Config**: Initializes AWS S3 client with credentials
- **S3Service**: Generates presigned URLs for profile images
- **Endpoint**: `GET /users/profile-image/upload-url?fileName=<name>`
- **Image Prefix**: `profile-images/`

#### Pitch Service (Port 8081)
- **S3Config**: Initializes AWS S3 client with credentials
- **S3Service**: Generates presigned URLs for pitch images
- **Endpoint**: `GET /pitches/pitch-image/upload-url?fileName=<name>`
- **Image Prefix**: `pitch-images/`

### Frontend Components

#### S3Service (`src/services/s3Service.js`)
- `getProfileImageUploadUrl(fileName)` - Get presigned URL for profile images
- `getPitchImageUploadUrl(fileName)` - Get presigned URL for pitch images
- `uploadFileToS3(presignedUrl, file, contentType)` - Upload file to S3
- `uploadFile(file, type)` - Combined function to get URL and upload

#### Profile Page (`src/pages/Profile.jsx`)
- Click on profile picture to upload new image
- Automatically uploads to S3 and updates user profile
- Shows loading state and error messages

#### Create Pitch Component (`src/components/NewCreatePitch.jsx`)
- Select image in pitch creation form
- Automatically uploads to S3 before creating pitch
- S3 URL is sent to backend instead of base64 data

## Setup Instructions

### 1. Environment Variables

Set these environment variables on your backend services:

```bash
# AWS Credentials
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

You can set these:
- In your system environment variables
- In a `.env` file (if using Spring Boot's environment property support)
- In Docker compose if containerizing

### 2. AWS S3 Bucket Configuration

1. Create an S3 bucket in AWS
2. Configure CORS policy for your bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["http://localhost:5173", "http://localhost:3001"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

3. Create IAM user with S3 permissions (bucket and object operations)

### 3. Backend Properties File

Update `application.properties` in both services with AWS configuration:

**User Service** (`collabit_user/src/main/resources/application.properties`):
```properties
aws.access-key=${AWS_ACCESS_KEY}
aws.secret-key=${AWS_SECRET_KEY}
aws.region=us-east-1
aws.s3.bucket-name=${AWS_S3_BUCKET_NAME}
```

**Pitch Service** (`collabit_pitch/src/main/resources/application.properties`):
```properties
aws.access-key=${AWS_ACCESS_KEY}
aws.secret-key=${AWS_SECRET_KEY}
aws.region=us-east-1
aws.s3.bucket-name=${AWS_S3_BUCKET_NAME}
```

### 4. Maven Dependencies

Both services have the AWS S3 SDK dependency in `pom.xml`:

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
</dependency>
```

## Testing the Integration

### Test Profile Picture Upload

1. Start the User Service: `mvn spring-boot:run` (port 8080)
2. Start the frontend: `npm run dev`
3. Navigate to Profile page
4. Hover over the profile picture
5. Click "Change" to upload a new image
6. Select an image file
7. Wait for upload to complete
8. Verify the new image appears and persists on refresh

### Test Pitch Image Upload

1. Start the Pitch Service: `mvn spring-boot:run` (port 8081)
2. Navigate to "Create a New Pitch"
3. Fill in pitch details
4. Select an image file for "Showcase Image"
5. Preview should show the local image
6. Click "Launch Pitch"
7. Verify pitch is created and image is displayed

### API Endpoint Testing

Using curl or Postman:

#### Get Profile Image Upload URL
```bash
curl -X GET "http://localhost:8080/users/profile-image/upload-url?fileName=test.jpg" \
  -H "Authorization: Bearer <token>" \
  -H "X-USER-ID: 1"
```

#### Get Pitch Image Upload URL
```bash
curl -X GET "http://localhost:8081/pitches/pitch-image/upload-url?fileName=test.jpg" \
  -H "Authorization: Bearer <token>" \
  -H "X-USER-ID: 1"
```

Both should return a presigned URL string that expires in 10 minutes.

## File Upload Flow

### Profile Picture Upload
1. User selects file from Profile page
2. Frontend calls `s3Service.uploadFile(file, "profile")`
3. S3Service requests presigned URL from backend
4. Backend generates URL with 10-minute expiration
5. Frontend uploads directly to S3 using presigned URL
6. Frontend gets S3 URL and calls `userService.updateMyProfile()` with new image URL
7. Profile is updated in backend database
8. User sees new profile picture immediately

### Pitch Image Upload
1. User selects file in Create Pitch form
2. User clicks "Launch Pitch"
3. Frontend calls `s3Service.uploadFile(file, "pitch")`
4. S3Service requests presigned URL from backend
5. Backend generates URL with 10-minute expiration
6. Frontend uploads directly to S3 using presigned URL
7. Frontend gets S3 URL and includes it in pitch creation payload
8. Backend creates pitch with S3 image URL
9. Pitch appears with image in feed

## File Organization in S3

```
bucket-name/
├── profile-images/
│   ├── 1704067200000-avatar.jpg
│   ├── 1704067205000-profile-pic.png
│   └── ...
└── pitch-images/
    ├── 1704067210000-project1.jpg
    ├── 1704067215000-idea.png
    └── ...
```

Files are organized by type (profile vs pitch) and prefixed with timestamps to ensure uniqueness.

## Error Handling

### Common Errors

1. **"Failed to get upload URL"**
   - Check AWS credentials are set correctly
   - Verify bucket name is correct
   - Ensure IAM user has S3 permissions

2. **"S3 upload failed with status 403"**
   - CORS policy not configured on bucket
   - Check bucket CORS settings match your frontend URL

3. **"No auth token found"**
   - User not authenticated
   - Log in again

4. **Presigned URL expires**
   - Default expiration is 10 minutes
   - Start upload within this time

### Debugging

- Check browser console for frontend errors
- Check backend logs for S3 SDK errors
- Verify S3 bucket policy allows your IAM user
- Test presigned URL directly with curl

## Production Considerations

1. **Credentials**: Store AWS credentials securely (AWS Secrets Manager, environment variables, IAM roles)
2. **Bucket Versioning**: Enable S3 versioning for audit trail
3. **Lifecycle Policies**: Set expiration for old images if needed
4. **CloudFront CDN**: Use CloudFront for faster image delivery
5. **File Size Limits**: Add client-side and server-side file size validation
6. **File Type Validation**: Restrict to image types only
7. **Security**: Enable S3 encryption at rest
8. **Logging**: Enable S3 access logging and CloudTrail

## Troubleshooting

### Images not persisting after upload
- Verify S3 bucket exists and is accessible
- Check that presigned URL includes full S3 path
- Ensure backend is saving the correct S3 URL to database

### CORS errors
- Update bucket CORS policy with correct frontend URLs
- Include all possible frontend domains/ports

### Slow uploads
- Consider using multipart uploads for large files
- Implement progress tracking
- Use CloudFront for faster distribution

## References

- [AWS SDK for Java Documentation](https://docs.aws.amazon.com/sdk-for-java/)
- [AWS S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [S3 CORS Configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)

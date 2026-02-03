/* eslint-disable no-useless-catch */
import { USER_SERVICE_URL, PITCH_SERVICE_URL } from "../config";
import { authService } from "./authService";

/**
 * S3 Upload Service
 * Handles presigned URL generation and file uploads to AWS S3
 */
export const s3Service = {
  /**
   * Get presigned URL for profile image upload
   * @param {string} fileName - Name of the file to upload
   * @returns {Promise<string>} - Presigned URL from the backend
   */
  getProfileImageUploadUrl: async (fileName) => {
    try {
      const token = authService.getToken();
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${USER_SERVICE_URL}/users/profile-image/upload-url?fileName=${encodeURIComponent(fileName)}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get upload URL for profile image");
      }

      return await response.text(); // Returns a string URL, not JSON
    } catch (error) {
      console.error("Error getting profile image upload URL:", error);
      throw error;
    }
  },

  /**
   * Get presigned URL for pitch image upload
   * @param {string} fileName - Name of the file to upload
   * @returns {Promise<string>} - Presigned URL from the backend
   */
  getPitchImageUploadUrl: async (fileName) => {
    try {
      const token = authService.getToken();
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${PITCH_SERVICE_URL}/pitches/pitch-image/upload-url?fileName=${encodeURIComponent(fileName)}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get upload URL for pitch image");
      }

      return await response.text(); // Returns a string URL, not JSON
    } catch (error) {
      console.error("Error getting pitch image upload URL:", error);
      throw error;
    }
  },

  /**
   * Upload file to S3 using presigned URL
   * @param {string} presignedUrl - Presigned URL from backend
   * @param {File} file - File object to upload
   * @param {string} contentType - MIME type of the file
   * @returns {Promise<Object>} - Response from S3
   */
  uploadFileToS3: async (presignedUrl, file, contentType = "image/jpeg") => {
    try {
      const response = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`S3 upload failed with status ${response.status}`);
      }

      // Extract the file URL from the presigned URL (remove query params)
      const s3FileUrl = presignedUrl.split("?")[0];
      return {
        success: true,
        url: s3FileUrl,
        presignedUrl: presignedUrl,
      };
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw error;
    }
  },

  /**
   * Combined function: Get URL and upload file
   * @param {File} file - File object to upload
   * @param {string} type - Type of upload: "profile" or "pitch"
   * @returns {Promise<string>} - S3 file URL
   */
  uploadFile: async (file, type = "profile") => {
    try {
      if (!file) throw new Error("No file provided");

      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;

      let presignedUrl;
      if (type === "profile") {
        presignedUrl = await s3Service.getProfileImageUploadUrl(fileName);
      } else if (type === "pitch") {
        presignedUrl = await s3Service.getPitchImageUploadUrl(fileName);
      } else {
        throw new Error("Invalid upload type. Use 'profile' or 'pitch'");
      }

      const uploadResult = await s3Service.uploadFileToS3(
        presignedUrl,
        file,
        file.type || "image/jpeg"
      );

      return uploadResult.url; // Return the S3 file URL
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      throw error;
    }
  },
};

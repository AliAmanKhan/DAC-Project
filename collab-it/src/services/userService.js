/* eslint-disable no-useless-catch */
import { USER_SERVICE_URL } from "../config";
import { authService } from "./authService";

const API_BASE_URL = `${USER_SERVICE_URL}/users`; 

export const userService = {
  updateMyProfile: async (userId, profile) => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No auth token found");
      console.log("Update Profile Request URL:", `${API_BASE_URL}/me`);
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "PUT",
        headers: {
          "X-USER-ID": userId,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Update profile failed");
      }
      return;
    } catch (err) {
      throw err;
    }
  },

  getMyProfile: async () => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No auth token found");

      // Read stored user id (may be saved as `id` or `userId` depending on where it came from)
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      const userId = stored?.id || stored?.userId;
      if (!userId) throw new Error("Missing user id for X-USER-ID header");

      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-USER-ID": userId,
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Fetch profile failed");
      }
      return await response.json();
    } catch (err) {
      throw err;
    }
  },

  getFullProfile: async (userId) => {
    try {
      if (!userId) throw new Error("Target userId is required for getFullProfile");

      const token = authService.getToken();
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // viewer id (the current user) is required as X-USER-ID
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      const viewerId = stored?.id || stored?.userId;
      if (!viewerId) throw new Error("Missing current user id for X-USER-ID header");
      headers["X-USER-ID"] = viewerId;

      const response = await fetch(`${API_BASE_URL}/${userId}/full`, {
        headers,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Fetch full profile failed");
      }
      return await response.json();
    } catch (err) {
      throw err;
    }
  },

  updateEducation: async (userId, educationList) => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No auth token found");
      if (!userId) throw new Error("Missing user id for X-USER-ID header");

      const response = await fetch(`${API_BASE_URL}/me/education`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-USER-ID": userId,
        },
        body: JSON.stringify(educationList),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Update education failed");
      }
      return;
    } catch (err) {
      throw err;
    }
  },

  updateSocialLinks: async (userId, links) => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No auth token found");
      if (!userId) throw new Error("Missing user id for X-USER-ID header");

      const response = await fetch(`${API_BASE_URL}/me/social-links`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-USER-ID": userId,
        },
        body: JSON.stringify(links),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Update social links failed");
      }
      return;
    } catch (err) {
      throw err;
    }
  },

  getUserById: async (userId) => {
    try {
      if (!userId) throw new Error("User ID is required");

      const token = authService.getToken();
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // If possible, add current user as X-USER-ID
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      const currentUserId = stored?.id || stored?.userId;
      if (currentUserId) headers["X-USER-ID"] = currentUserId;

      // Use the /full endpoint to get complete user profile
      const response = await fetch(`${API_BASE_URL}/${userId}/full`, {
        headers,
      });

      if (!response.ok) {
        console.warn(`Failed to fetch user ${userId}:`, response.status);
        return null; // Return null instead of throwing
      }
      return await response.json();
    } catch (err) {
      console.warn("Error fetching user details:", err);
      return null; // Return null on error
    }
  },
};

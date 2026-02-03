/* eslint-disable no-useless-catch */
import { COLLAB_SERVICE_URL } from "../config";
import { authService } from "./authService";

const API_BASE_URL = `${COLLAB_SERVICE_URL}/collaborations`; 

export const collabService = {
  requestToJoin: async (requestData) => {
    // requestData: { pitchId, message, role, ... }
    try {
      const token = authService.getToken();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const currentUserId = user.id || user.userId;
      console.log("Request to Join URL:", `${API_BASE_URL}/request`);
      console.log("User: ", user);
      const response = await fetch(`${API_BASE_URL}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-USER-ID": currentUserId || "",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to send request");
      }
      return;
    } catch (error) {
      throw error;
    }
  },

  actOnRequest: async (requestId, accept) => {
      // accept: boolean
    try {
      const token = authService.getToken();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const currentUserId = user.id || user.userId;
      const response = await fetch(`${API_BASE_URL}/request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-USER-ID": currentUserId || "",
        },
        body: JSON.stringify({ accept }), // CollaborationActionRequest
      });

      if (!response.ok) {
         const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update request");
      }
      return;
    } catch (error) {
      throw error;
    }
  },

  withdrawRequest: async (requestId) => {
    try {
      const token = authService.getToken();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const currentUserId = user.id || user.userId;
      const response = await fetch(`${API_BASE_URL}/request/${requestId}/withdraw`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-USER-ID": currentUserId || "",
        }
      });

       if (!response.ok) {
         const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to withdraw request");
      }
    } catch(error) {
        throw error;
    }
  },

  getRequestsForPitch: async (pitchId) => {
    try {
      const token = authService.getToken();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const currentUserId = user.id || user.userId;
      const response = await fetch(`${API_BASE_URL}/pitch/${pitchId}/requests`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-USER-ID": currentUserId || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getProjectMembers: async (pitchId) => {
    try {
      const token = authService.getToken();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const currentUserId = user.id || user.userId;
      const response = await fetch(`${API_BASE_URL}/pitch/${pitchId}/members`, {
         headers: {
          "Authorization": `Bearer ${token}`, // Optional if public?
          "X-USER-ID": currentUserId || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getNotificationsForPitchOwner: async (userId) => {
    try {
      const token = authService.getToken();
      console.log("Fetching notifications from API - userId:", userId);
      const response = await fetch(`${API_BASE_URL}/notifications/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-USER-ID": userId || "",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch notifications. Status:", response.status);
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      console.log("Notifications API response:", data);
      return data;
    } catch (error) {
      throw error;
    }
  },

  getUnreadNotifications: async (userId) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/notifications/${userId}/unread`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-USER-ID": userId || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch unread notifications");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      const token = authService.getToken();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const currentUserId = user.id || user.userId;
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-USER-ID": currentUserId || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      return;
    } catch (error) {
      throw error;
    }
  },
};

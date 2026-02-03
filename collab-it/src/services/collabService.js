/* eslint-disable no-useless-catch */
import { COLLAB_SERVICE_URL } from "../config";
import { authService } from "./authService";

const API_BASE_URL = `${COLLAB_SERVICE_URL}/collaborations`; 

export const collabService = {
  requestToJoin: async (requestData) => {
    // requestData: { pitchId, message, role, ... }
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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
      const response = await fetch(`${API_BASE_URL}/request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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
      const response = await fetch(`${API_BASE_URL}/request/${requestId}/withdraw`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
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
      const response = await fetch(`${API_BASE_URL}/pitch/${pitchId}/requests`, {
        headers: {
          "Authorization": `Bearer ${token}`,
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
      const response = await fetch(`${API_BASE_URL}/pitch/${pitchId}/members`, {
         headers: {
          "Authorization": `Bearer ${token}`, // Optional if public?
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
};

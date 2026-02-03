/* eslint-disable no-useless-catch */
import { PITCH_SERVICE_URL } from "../config";
import { authService } from "./authService";

const API_BASE_URL = `${PITCH_SERVICE_URL}/pitches`; 

export const pitchService = {
  createPitch: async (pitchData) => {
    try {
      const token = authService.getToken();
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      const userId = stored?.id || stored?.userId;

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (userId) headers["X-USER-ID"] = userId;

      // Replace base64 image data with a default URL before sending to backend
      const DEFAULT_IMAGE_URL = "https://via.placeholder.com/800x450?text=Pitch+Image";
      const payloadToSend = { ...pitchData };
      if (payloadToSend.image && typeof payloadToSend.image === "string" && payloadToSend.image.startsWith("data:")) {
        payloadToSend.image = DEFAULT_IMAGE_URL;
      }

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payloadToSend),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create pitch");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updatePitch: async (pitchId, pitchData) => {
    try {
      const token = authService.getToken();

      // Replace base64 image data with a default URL before sending to backend
      const DEFAULT_IMAGE_URL = "https://via.placeholder.com/800x450?text=Pitch+Image";
      const payloadToSend = { ...pitchData };
      if (payloadToSend.image && typeof payloadToSend.image === "string" && payloadToSend.image.startsWith("data:")) {
        payloadToSend.image = DEFAULT_IMAGE_URL;
      }

      const response = await fetch(`${API_BASE_URL}/${pitchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payloadToSend),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update pitch");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deletePitch: async (pitchId) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/${pitchId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete pitch");
      }
    } catch (error) {
      throw error;
    }
  },

  getPitch: async (pitchId) => {
    try {
      const token = authService.getToken();
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      const userId = stored?.id || stored?.userId;

       const headers = {};
       if(token) headers["Authorization"] = `Bearer ${token}`;
       if(userId) headers["X-USER-ID"] = userId;

      const response = await fetch(`${API_BASE_URL}/${pitchId}`, {
         headers
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pitch");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getMyPitches: async () => {
    try {
      const token = authService.getToken();
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      const userId = stored?.id || stored?.userId;

      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (userId) headers["X-USER-ID"] = userId;

      const response = await fetch(`${API_BASE_URL}/me`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch my pitches");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getRecommendedPitches: async (interests = [], limit = 6) => {
    try {
      const token = authService.getToken();
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      const userId = stored?.id || stored?.userId;

      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (userId) headers["X-USER-ID"] = userId;

      // build query params for interests (array -> repeated params or comma separated)
      const params = new URLSearchParams();
      if (Array.isArray(interests) && interests.length > 0) {
        interests.forEach((i) => params.append("interests", i));
      }
      params.set("limit", String(limit || 6));

      const url = `${API_BASE_URL}/recommended?${params.toString()}`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch recommended pitches");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

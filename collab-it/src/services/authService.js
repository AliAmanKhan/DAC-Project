/* eslint-disable no-useless-catch */
import { AUTH_SERVICE_URL } from "../config";
const API_BASE_URL = `${AUTH_SERVICE_URL}/auth`; 

export const authService = {
  signup: async (formData) => {
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        headline: formData.headline,
        bio: formData.bio,
        skills: formData.skills,
        interests: formData.interests,
        experience: formData.experience,
        avatar: formData.avatar,
      };

      console.log("Signup Request URL:", `${API_BASE_URL}/signup`);
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Signup failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || "Login failed");
    }

    const data = await response.json();
    return data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  getToken: () => {
    return localStorage.getItem("authToken");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || "Failed to send reset email");
    }

    const data = await response.json();
    return data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || "Failed to reset password");
    }

    const data = await response.json();
    return data;
  },
};

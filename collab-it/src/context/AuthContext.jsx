/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch full profile from user service and update local state/storage
  const refreshUserProfile = async () => {
    try {
      const profile = await userService.getMyProfile();
      // profile matches backend UserProfileResponse
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
    } catch (err) {
      console.warn("Failed to refresh user profile:", err?.message || err);
    }
  };

  // on mount / when auth state changes -> refresh profile so components can show full details
  useEffect(() => {
    if (isAuthenticated) {
      refreshUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const signup = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signup(formData);

      // store token and basic user info including id
      const userData = {
        id: response.user?.id,
        username: response.user?.username || formData.email,
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // send profile data to user service (onboarding) — map fields to UserProfileUpdateRequest
      const profilePayload = {
        fullName: formData.fullName,
        bio: formData.bio || null,
        dob: null,
        gender: null,
        profileImage: formData.avatar || null,
        college: null,
        branch: null,
        graduationYear: null,
        visibility: "PUBLIC",
      };

      // attempt to update profile; if it fails, don't block signup but surface the error
      try {
        console.log("User ID: ", userData.id);
        await userService.updateMyProfile(userData.id, profilePayload);
      } catch (profileErr) {
        console.warn("Profile update failed after signup:", profileErr.message);
        // We still succeed signup, but report profile error in `error` state
        setError("Profile update failed. You can complete onboarding later.");
      }

      // fetch fresh profile details and store them
      try {
        await refreshUserProfile();
      } catch (e) {
        // already handled inside refreshUserProfile; nothing to do
      }

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      const userData = { id: response.user?.id, username: response.user?.username || email };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // after login, fetch full profile
      try {
        await refreshUserProfile();
      } catch (e) {
        // already handled
      }

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        signup,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

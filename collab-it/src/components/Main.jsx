import React, { useEffect, useState } from "react";
import Dashboard from "../pages/Dashboard";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Projects from "../pages/Projects";
import NewPitch from "../pages/NewPitch";
import Profile from "../pages/Profile";
import PitchDetailPage from "../pages/PitchDetailsPage";
import MyPitches from "../pages/MyPitches";
import Login from "../pages/Login";
import LandingPage from "../pages/LandingPage";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Team from "../pages/Team";
import Messages from "../pages/Messages";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import Collaborations from "../pages/Collaborations";
import { AuthProvider } from "../context/AuthContext";

export default function Main() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); // <-- get current route

  // Check if current route is /login or /signup or /landing or password reset pages
  const hideLayout = location.pathname === "/login" || location.pathname === "/landing" || location.pathname === "/signup" || location.pathname === "/forgot-password" || location.pathname === "/reset-password";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex h-screen">

          {/* Sidebar (Hidden on /login) */}
          {!hideLayout && (
            <Sidebar
              setIsSidebarOpen={setIsSidebarOpen}
              handleNavClick={handleNavClick}
              isSidebarOpen={isSidebarOpen}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">

            {/* Header (Hidden on /login) */}
            {!hideLayout && <Header setIsSidebarOpen={setIsSidebarOpen} />}

            {/* Routes */}
            <Routes>
              <Route path="/" element={<Navigate replace to="/landing" />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/create" element={<NewPitch />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/pitches" element={<MyPitches />} />
              <Route path="/pitch/:id" element={<PitchDetailPage />} />
              <Route path="/team" element={<Team />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/collaborations" element={<Collaborations />} />
            </Routes>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

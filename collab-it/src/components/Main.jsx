import React, { useEffect, useState } from "react";
import Dashboard from "../pages/Dashboard";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import Projects from "../pages/Projects";
import CreatePitch from "./CreatePitch";
import NewPitch from "../pages/NewPitch";

export default function Main() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on resize to >= md (768px), similar to original behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (e) => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex h-screen">
        <Sidebar
          setIsSidebarOpen={setIsSidebarOpen}
          handleNavClick={handleNavClick}
          isSidebarOpen={isSidebarOpen}
        />
        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
          {/* Header */}
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <Routes>
            <Route path="/" element={<Navigate replace to="/dashboard" />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/projects" element={<Projects />}></Route>
            <Route path="/create" element={<NewPitch />}></Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

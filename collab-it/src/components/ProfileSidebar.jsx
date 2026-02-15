import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfileSidebar() {
  const { user, isAuthenticated } = useAuth();
  const avatarSeed = encodeURIComponent(user?.username || user?.fullName || "guest");
  const avatarUrl = user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`; 
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  // Track viewport width to know if we're in "mobile view"
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint is 768px
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProfileClick = () => {
    if (isMobile) {
      // On mobile → go to a dedicated page instead of opening sidebar
      navigate("/profile"); // change to whatever route you want
    } else {
      // On desktop/tablet → open sliding sidebar
      setIsOpen(true);
    }
  };

  const closeSidebar = () => setIsOpen(false);

  const menuItems = [
    { label: "My Profile", path: "/profile" },
    { label: "My Pitches", path: "/pitches" },
    { label: "Settings", path: "/settings" },
    { label: "Logout", path: "/logout" }, // you can handle this differently
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <>
      {/* Profile icon (put this in your header/right corner) */}
      <button
        onClick={handleProfileClick}
        className="flex items-center gap-2 rounded-full border border-border px-2 py-1 hover:bg-sidebar-hover transition"
      >
        <img
          src={avatarUrl}
          alt={user?.fullName || user?.username || 'User'}
          className="w-8 h-8 rounded-full"
        />
        <span className="hidden sm:inline text-sm text-muted-foreground">{user?.fullName || user?.username || 'Profile'}</span>
      </button>

      {/* Sliding sidebar + overlay (desktop/tablet only) */}
      {!isMobile && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 right-0 z-50 w-72 bg-sidebar border-l border-sidebar-border 
              transform transition-transform duration-300 ease-out
              ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt={user?.fullName || user?.username || 'User'}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{user?.fullName || user?.username || 'Guest'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'Member'}</p>
                </div>
              </div>
              <button
                onClick={closeSidebar}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu */}
            <nav className="px-3 py-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm 
                             text-foreground hover:bg-sidebar-hover transition"
                >
                  <span>{item.label}</span>
                  <svg
                    className="w-4 h-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}

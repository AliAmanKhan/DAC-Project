import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileSidebar() {
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
        className="flex items-center gap-2 rounded-full border border-slate-600 px-2 py-1 hover:bg-slate-800 transition"
      >
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
          alt="User"
          className="w-8 h-8 rounded-full"
        />
        <span className="hidden sm:inline text-sm text-slate-200">Profile</span>
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
            className={`fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 border-l border-slate-700 
              transform transition-transform duration-300 ease-out
              ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-white">John Doe</p>
                  <p className="text-xs text-slate-400">Admin</p>
                </div>
              </div>
              <button
                onClick={closeSidebar}
                className="text-slate-400 hover:text-white"
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
                             text-slate-200 hover:bg-slate-800 transition"
                >
                  <span>{item.label}</span>
                  <svg
                    className="w-4 h-4 text-slate-400"
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

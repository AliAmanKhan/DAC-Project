import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { Bell } from "lucide-react";
import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import NotificationsPanel from "./NotificationsPanel";
import { useAuth } from "../context/AuthContext";

export default function Header({ setIsSidebarOpen }) {
  const navigation = useNavigate();
  const navigate = (loc) => {
    navigation(loc);
  };

  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const avatarSeed = encodeURIComponent(user?.username || user?.fullName || "guest");
  const avatarUrl = user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

  return (
    <header className="sticky top-0 z-30 h-16 bg-header border-b border-header-border px-6 flex items-center justify-between transition-colors duration-300">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsSidebarOpen(true)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="flex-1 text-center md:text-left">
        <h2 className="text-foreground font-semibold">Welcome to Dashboard</h2>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3">
          <div
            data-tooltip-id="my-tooltip"
            data-tooltip-content="New Pitch"
            onClick={() => navigate("/create")}
            className="icon text-2xl font-medium text-foreground bg-card border border-border hover:bg-sidebar-hover cursor-pointer transition-colors"
            style={{ borderRadius: "10%", padding: "0 8px 2px 8px" }}
          >
            +
          </div>
          <Tooltip id="my-tooltip" />
          
          {/* Notification Bell */}
          {user && (
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-sidebar-hover rounded-lg transition relative text-foreground"
            >
              <Bell className="w-5 h-5" />
            </button>
          )}

          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.fullName || user?.username || "Guest"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || "Member"}</p>
          </div>

          <ProfileSidebar />
        </div>
      </div>

      {/* Notifications Panel */}
      {user && <NotificationsPanel userId={user?.id || user?.userId} isOpen={showNotifications} onClose={() => setShowNotifications(false)} />}
    </header>
  );
}

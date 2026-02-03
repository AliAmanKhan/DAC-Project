import { Zap, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const avatarSeed = encodeURIComponent(user?.username || user?.fullName || "guest");
  const avatarUrl = user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Zap className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold gradient-text">collabit</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Explore
          </Link>
          <Link
            to="/create-pitch"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Create Pitch
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 hover:bg-card rounded-lg transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 p-1 hover:bg-card rounded-lg transition"
              >
                <img src={avatarUrl} alt={user?.fullName || user?.username} className="w-8 h-8 rounded-full" />
                <span className="hidden sm:inline text-sm">{user?.fullName || user?.username}</span>
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="p-2 hover:bg-card rounded-lg transition">
                <span className="text-sm">Sign in</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

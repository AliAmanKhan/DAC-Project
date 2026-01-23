import { Zap, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Zap className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold gradient-text">collabit</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Explore
          </Link>
          <Link
            href="/create-pitch"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Create Pitch
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-card rounded-lg transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-card rounded-lg transition">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

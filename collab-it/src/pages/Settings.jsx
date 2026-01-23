import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Palette,
  Save,
  LogOut,
} from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: "dark",
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    privacy: {
      profileVisible: true,
      showActivity: true,
      allowMessages: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (category, key) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const handleThemeChange = (theme) => {
    setSettings((prev) => ({
      ...prev,
      theme,
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      console.log("Settings saved:", settings);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-card to-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <SettingsIcon className="w-10 h-10 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account preferences and settings
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Account Settings */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              Account Settings
            </h2>

            <div className="space-y-6">
              {/* Profile Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Change Password
                </label>
                <button className="px-4 py-2 rounded-lg border border-border hover:bg-primary/10 transition">
                  Update Password
                </button>
              </div>

              {/* Two-Factor */}
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Theme & Appearance */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Palette className="w-6 h-6 text-primary" />
              Theme & Appearance
            </h2>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme
              </p>
              <div className="grid grid-cols-3 gap-4">
                {["light", "dark", "system"].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={`p-4 rounded-lg border-2 transition ${
                      settings.theme === theme
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold capitalize mb-2">
                      {theme} Mode
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {theme === "light" && "Bright and clean"}
                      {theme === "dark" && "Easy on the eyes"}
                      {theme === "system" && "Follow system"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              Notifications
            </h2>

            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/5 transition"
                >
                  <div>
                    <h3 className="font-semibold capitalize">{key} Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive {key} updates about your projects and collaborations
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("notifications", key)}
                    className={`relative inline-flex h-6 w-11 rounded-full transition ${
                      value ? "bg-primary" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        value ? "translate-x-6" : "translate-x-1"
                      } mt-1`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Privacy & Security</h2>

            <div className="space-y-4">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/5 transition"
                >
                  <div>
                    <h3 className="font-semibold capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {key === "profileVisible" && "Let others see your profile"}
                      {key === "showActivity" && "Show your activity to team"}
                      {key === "allowMessages" && "Allow messages from collaborators"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("privacy", key)}
                    className={`relative inline-flex h-6 w-11 rounded-full transition ${
                      value ? "bg-primary" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        value ? "translate-x-6" : "translate-x-1"
                      } mt-1`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button className="flex-1 px-6 py-3 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition font-medium flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

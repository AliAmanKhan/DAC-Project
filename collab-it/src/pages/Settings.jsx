import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Palette,
  Save,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState({
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
  const [showSaved, setShowSaved] = useState(false);

  const handleToggle = (category, key) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
      console.log("Settings saved:", { theme, ...settings });
    }, 1000);
  };

  const themeOptions = [
    { id: "light", label: "Light Mode", description: "Bright and clean", icon: Sun },
    { id: "dark", label: "Dark Mode", description: "Easy on the eyes", icon: Moon },
    { id: "system", label: "System", description: "Follow system", icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-card to-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-foreground">
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
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
              <Lock className="w-6 h-6 text-primary" />
              Account Settings
            </h2>

            <div className="space-y-6">
              {/* Profile Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Change Password
                </label>
                <button className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-primary/10 transition">
                  Update Password
                </button>
              </div>

              {/* Two-Factor */}
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1 text-foreground">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Theme & Appearance */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
              <Palette className="w-6 h-6 text-primary" />
              Theme & Appearance
            </h2>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme
              </p>
              <div className="grid grid-cols-3 gap-4">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = theme === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleThemeChange(option.id)}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 text-left group ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                          : "border-border hover:border-primary/50 hover:bg-card"
                      }`}
                    >
                      <div className={`mb-3 inline-flex p-2 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} transition-colors`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="font-semibold text-foreground mb-1">
                        {option.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
              <Bell className="w-6 h-6 text-primary" />
              Notifications
            </h2>

            <div className="space-y-2">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="text-left">
                    <h3 className="font-semibold capitalize text-foreground">{key} Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive {key} updates about your projects and collaborations
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("notifications", key)}
                    className={`relative inline-flex h-7 w-12 rounded-full transition-all duration-300 shrink-0 ${
                      value ? "bg-toggle-on shadow-md shadow-primary/30" : "bg-toggle-off"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-all duration-300 ${
                        value ? "translate-x-6" : "translate-x-1"
                      } mt-1`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Privacy & Security</h2>

            <div className="space-y-2">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="text-left">
                    <h3 className="font-semibold capitalize text-foreground">
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
                    className={`relative inline-flex h-7 w-12 rounded-full transition-all duration-300 shrink-0 ${
                      value ? "bg-toggle-on shadow-md shadow-primary/30" : "bg-toggle-off"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-all duration-300 ${
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
              className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-primary/20"
            >
              <Save className="w-5 h-5" />
              {isSaving ? "Saving..." : showSaved ? "✓ Saved!" : "Save Changes"}
            </button>
            <button className="flex-1 px-6 py-3 rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 transition font-medium flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

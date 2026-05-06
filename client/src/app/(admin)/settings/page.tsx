"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Smartphone,
  AlertCircle,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

// Profile Settings Component
function ProfileSettings() {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@penclub.com",
    username: "johndoe",
    bio: "Platform administrator passionate about books and technology.",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    website: "https://johndoe.com"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h3 className="text-xl font-serif font-bold text-primary uppercase tracking-widest">Profile Information</h3>
        <p className="text-xs text-muted-foreground mt-1.5 font-serif italic">Update your personal and administrative credentials</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm font-serif italic"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm font-serif italic"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm font-serif italic"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm font-serif italic"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">Bio</label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm font-serif italic leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm font-serif italic"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm font-serif italic"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-primary/10">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-primary border border-primary rounded-none hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-green-600">
              <CheckCircle className="w-4 h-4" />
              Saved successfully!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Security Settings Component
function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h3 className="text-xl font-serif font-bold text-primary uppercase tracking-widest">Security Settings</h3>
        <p className="text-xs text-muted-foreground mt-1.5 font-serif italic">Manage your password and active session authorizations</p>
      </div>

      {/* Change Password */}
      <div className="border border-primary/20 rounded-none p-6 space-y-5 bg-primary/[0.01]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Change Password</h4>
        
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-primary/45 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        <button className="cursor-pointer px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-primary border border-primary rounded-none hover:opacity-90 transition-all">
          Update Password
        </button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border border-primary/20 rounded-none p-6 bg-primary/[0.01]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Two-Factor Authentication</h4>
            <p className="text-xs text-muted-foreground mt-1 font-serif italic">Add an extra layer of security to your administrator credentials</p>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`cursor-pointer w-12 h-6 border transition-colors flex items-center px-1 rounded-none ${
              twoFactorEnabled ? "bg-primary border-primary justify-end" : "bg-transparent border-primary/20 justify-start"
            }`}
          >
            <div className={`w-4 h-4 rounded-none ${twoFactorEnabled ? "bg-white" : "bg-primary/40"}`} />
          </button>
        </div>
      </div>

      {/* Session Management */}
      <div className="border border-primary/20 rounded-none p-6 bg-primary/[0.01]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Active Authorization Sessions</h4>
        
        <div className="divide-y divide-primary/10">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-primary/60" />
              <div>
                <p className="text-sm font-bold text-primary">Chrome on Windows</p>
                <p className="text-[10px] text-primary/45 uppercase tracking-wider font-bold">New York, USA • Active now</p>
              </div>
            </div>
            <button className="cursor-pointer text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-700 transition-colors">Revoke</button>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-primary/60" />
              <div>
                <p className="text-sm font-bold text-primary">Safari on Mac</p>
                <p className="text-[10px] text-primary/45 uppercase tracking-wider font-bold">Last active 2 hours ago</p>
              </div>
            </div>
            <button className="cursor-pointer text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-700 transition-colors">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notifications Settings Component
function NotificationsSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bookUpdates: true,
    newFollowers: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h3 className="text-xl font-serif font-bold text-primary uppercase tracking-widest">Notification Preferences</h3>
        <p className="text-xs text-muted-foreground mt-1.5 font-serif italic">Choose what updates and communications you receive</p>
      </div>

      <div className="divide-y divide-primary/15 border border-primary/20 bg-primary/[0.01] p-6 rounded-none">
        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Email Notifications</h4>
            <p className="text-xs text-muted-foreground mt-0.5 font-serif italic">Receive administrative logs and updates via email</p>
          </div>
          <button
            onClick={() => toggleSetting("emailNotifications")}
            className={`cursor-pointer w-12 h-6 border transition-colors flex items-center px-1 rounded-none ${
              settings.emailNotifications ? "bg-primary border-primary justify-end" : "bg-transparent border-primary/20 justify-start"
            }`}
          >
            <div className={`w-4 h-4 rounded-none ${settings.emailNotifications ? "bg-white" : "bg-primary/40"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Push Notifications</h4>
            <p className="text-xs text-muted-foreground mt-0.5 font-serif italic">Receive instant platform notifications in browser</p>
          </div>
          <button
            onClick={() => toggleSetting("pushNotifications")}
            className={`cursor-pointer w-12 h-6 border transition-colors flex items-center px-1 rounded-none ${
              settings.pushNotifications ? "bg-primary border-primary justify-end" : "bg-transparent border-primary/20 justify-start"
            }`}
          >
            <div className={`w-4 h-4 rounded-none ${settings.pushNotifications ? "bg-white" : "bg-primary/40"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Book Updates</h4>
            <p className="text-xs text-muted-foreground mt-0.5 font-serif italic">New documents from authors you monitor</p>
          </div>
          <button
            onClick={() => toggleSetting("bookUpdates")}
            className={`cursor-pointer w-12 h-6 border transition-colors flex items-center px-1 rounded-none ${
              settings.bookUpdates ? "bg-primary border-primary justify-end" : "bg-transparent border-primary/20 justify-start"
            }`}
          >
            <div className={`w-4 h-4 rounded-none ${settings.bookUpdates ? "bg-white" : "bg-primary/40"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">New Followers</h4>
            <p className="text-xs text-muted-foreground mt-0.5 font-serif italic">Alerts when new readers register profiles</p>
          </div>
          <button
            onClick={() => toggleSetting("newFollowers")}
            className={`cursor-pointer w-12 h-6 border transition-colors flex items-center px-1 rounded-none ${
              settings.newFollowers ? "bg-primary border-primary justify-end" : "bg-transparent border-primary/20 justify-start"
            }`}
          >
            <div className={`w-4 h-4 rounded-none ${settings.newFollowers ? "bg-white" : "bg-primary/40"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Danger Zone Component
function DangerZone() {
  const [confirmText, setConfirmText] = useState("");

  return (
    <div className="space-y-6 font-inter">
      <div>
        <h3 className="text-xl font-serif font-bold text-red-600 uppercase tracking-widest">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mt-1.5 font-serif italic">Irreversible system and administrative operations</p>
      </div>

      <div className="border border-red-200 rounded-none p-6 bg-red-500/5">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-red-900 uppercase tracking-wider">Delete Administrator Account</h4>
            <p className="text-xs text-red-700/80 mt-1.5 font-serif italic leading-relaxed">
              Once you delete your account, all credentials, active logs, and administrative keys will be permanently destroyed.
            </p>
            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Type 'DELETE' to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full max-w-sm px-4 py-3 border border-red-200 rounded-none focus:outline-none focus:border-red-500 bg-white text-sm font-mono"
              />
              <button
                disabled={confirmText !== "DELETE"}
                className="cursor-pointer block px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-red-600 rounded-none hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Settings Page
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "danger", label: "Danger Zone", icon: AlertCircle },
  ];

  return (
    <div className="pt-2 px-8 pb-8 space-y-8 font-inter">
      {/* Header */}
      <div className="border-b border-primary/20 pb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
          Platform Controls
        </span>
        <h1 className="text-3xl font-serif font-bold text-primary mt-1 tracking-tight">Settings</h1>
        <p className="text-xs text-muted-foreground mt-1.5 font-serif italic">Manage your account preferences and system configurations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-8 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer w-full flex items-center gap-4 px-5 py-4 border transition-all rounded-none ${
                    activeTab === tab.id
                      ? "bg-primary border-primary text-white font-bold"
                      : "border-primary/10 text-primary/60 hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card border border-primary/20 rounded-none p-8">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "notifications" && <NotificationsSettings />}
          {activeTab === "danger" && <DangerZone />}
        </div>
      </div>
    </div>
  );
}
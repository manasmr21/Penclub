"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Lock,
  Smartphone,
  CreditCard,
  Users,
  FileText,
  AlertCircle,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Moon,
  Sun,
  Monitor
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
        <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          {saveSuccess && (
            <span className="flex items-center gap-1 text-sm text-green-600">
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Manage your password and security preferences</p>
      </div>

      {/* Change Password */}
      <div className="border border-gray-100 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-900">Change Password</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
          />
        </div>

        <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Update Password
        </button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border border-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              twoFactorEnabled ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                twoFactorEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Session Management */}
      <div className="border border-gray-100 rounded-lg p-4">
        <h4 className="font-medium text-gray-900">Active Sessions</h4>
        <p className="text-sm text-gray-500 mt-1">Manage your active sessions</p>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Chrome on Windows</p>
                <p className="text-xs text-gray-500">New York, USA • Active now</p>
              </div>
            </div>
            <button className="cursor-pointer text-sm text-red-600 hover:text-red-700">Revoke</button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Safari on Mac</p>
                <p className="text-xs text-gray-500">Last active 2 hours ago</p>
              </div>
            </div>
            <button className="cursor-pointer text-sm text-red-600 hover:text-red-700">Revoke</button>
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
    marketingEmails: false,
    bookUpdates: true,
    newFollowers: true,
    commentsReplies: true,
    weeklyDigest: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        <p className="text-sm text-gray-500 mt-1">Choose what notifications you want to receive</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <button
            onClick={() => toggleSetting("emailNotifications")}
            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.emailNotifications ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.emailNotifications ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <h4 className="font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-500">Receive push notifications in browser</p>
          </div>
          <button
            onClick={() => toggleSetting("pushNotifications")}
            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.pushNotifications ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.pushNotifications ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <h4 className="font-medium text-gray-900">Book Updates</h4>
            <p className="text-sm text-gray-500">New books from followed authors</p>
          </div>
          <button
            onClick={() => toggleSetting("bookUpdates")}
            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.bookUpdates ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.bookUpdates ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <h4 className="font-medium text-gray-900">New Followers</h4>
            <p className="text-sm text-gray-500">When someone follows you</p>
          </div>
          <button
            onClick={() => toggleSetting("newFollowers")}
            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.newFollowers ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.newFollowers ? "translate-x-6" : "translate-x-1"
            }`} />
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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
        <p className="text-sm text-gray-500 mt-1">Irreversible actions</p>
      </div>

      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-red-900">Delete Account</h4>
            <p className="text-sm text-red-700 mt-1">
              Once you delete your account, there is no going back. This action is permanent and cannot be undone.
            </p>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Type 'DELETE' to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full max-w-sm px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:border-red-500 bg-white"
              />
              <button
                disabled={confirmText !== "DELETE"}
                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Account
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
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "danger", label: "Danger Zone", icon: AlertCircle },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-6 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-gray-100 rounded-lg p-6">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "notifications" && <NotificationsSettings />}
          {activeTab === "danger" && <DangerZone />}
        </div>
      </div>
    </div>
  );
}
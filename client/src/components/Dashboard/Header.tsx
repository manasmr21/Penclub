"use client";

import { Menu, Bell, Search, X, User, Settings, LogOut, ChevronDown, HelpCircle, MessageCircle, Grid } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationPanel, useNotifications } from "./NotificationPanel";

export function Header({ collapsed, setCollapsed, setMobileOpen }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef(null);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  const user = {
    name: "John Doe",
    email: "john@penclub.com",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff"
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Left section - Logo and Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Desktop collapse button */}
          <button
            className="hidden lg:flex cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Logo - visible when sidebar is collapsed on desktop */}
          {collapsed && (
            <div className="hidden lg:flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
            </div>
          )}

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 min-w-[320px] border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-all group">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search for books, authors, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 flex-1 ml-3"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="cursor-pointer p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
            <kbd className="hidden lg:inline-block text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md ml-2">
              ⌘K
            </kbd>
          </form>
        </div>

        {/* Center - Page Title with Breadcrumb */}
        <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Pages</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">Dashboard</span>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search button */}
          <button
            className="md:hidden cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Quick Actions Dropdown */}
          <div className="relative hidden sm:block">
            <button className="cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-all duration-200">
              <Grid className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Help Button */}
          <button className="hidden sm:flex cursor-pointer items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200">
            <HelpCircle className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Help</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="cursor-pointer relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                  <span className="absolute inset-0 rounded-xl animate-ping bg-red-400 opacity-75"></span>
                </>
              )}
            </button>

            {/* Notification Panel */}
            <NotificationPanel
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
            />
          </div>

          {/* User Avatar & Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="cursor-pointer flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white"></div>
              </div>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
              <ChevronDown className="hidden lg:block w-4 h-4 text-gray-400" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-50 animate-slideDown">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Profile</span>
                  </button>
                  <button className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span>Messages</span>
                    <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">3</span>
                  </button>
                  <button className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 py-2">
                  <button className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden p-4 border-t border-gray-100 bg-white animate-slideDown">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-700 flex-1"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="cursor-pointer p-1 mr-2"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
            <button 
              type="button"
              onClick={() => setIsSearchOpen(false)} 
              className="cursor-pointer text-xs text-gray-500 px-2 py-1 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </form>
          
          {/* Quick search suggestions */}
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-400">Recent searches</p>
            <div className="flex flex-wrap gap-2">
              <button className="cursor-pointer text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                Atomic Habits
              </button>
              <button className="cursor-pointer text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                John Doe
              </button>
              <button className="cursor-pointer text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                Fiction
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
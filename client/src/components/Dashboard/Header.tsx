"use client";

import { Menu, Bell, Search, X, User, Settings, LogOut, ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
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
  };

  const user = {
    name: "John Doe",
    email: "john@penclub.com",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D387D&color=fff"
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-primary/15 font-inter shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Left section - Logo and Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden cursor-pointer p-2 rounded-none border border-primary/15 hover:bg-primary/5 transition-all duration-200"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4 text-primary" />
          </button>

          {/* Desktop collapse button */}
          <button
            className="hidden lg:flex cursor-pointer p-2 rounded-none border border-primary/15 hover:bg-primary/5 transition-all duration-200"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-4 h-4 text-primary" />
          </button>

          {/* Logo - visible when sidebar is collapsed on desktop */}
          {collapsed && (
            <div className="hidden lg:flex items-center">
              <div className="w-8 h-8 rounded-none bg-[#0F4C9C] flex items-center justify-center border border-primary/25 shadow-sm">
                <span className="text-white font-bold text-sm font-serif">P</span>
              </div>
            </div>
          )}

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-primary/[0.01] rounded-none px-4 py-2 min-w-[320px] border border-primary/20 focus-within:border-[#0F4C9C] focus-within:bg-white transition-all group">
            <Search className="w-4 h-4 text-primary/40 group-focus-within:text-[#0F4C9C] transition-colors" />
            <input
              type="text"
              placeholder="Search for books, authors, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-xs font-serif italic text-primary placeholder-primary/40 flex-1 ml-3"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="cursor-pointer p-1 hover:bg-primary/5 border border-transparent hover:border-primary/10 rounded-none transition-colors"
              >
                <X className="w-3 h-3 text-primary/60" />
              </button>
            )}
          </form>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile search button */}
          <button
            className="md:hidden cursor-pointer p-2 rounded-none border border-primary/15 hover:bg-primary/5 transition-all"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-primary" />
          </button>

          {/* Help Button */}
          <button className="hidden sm:flex cursor-pointer items-center gap-1.5 px-3 py-2 rounded-none border border-primary/15 hover:bg-primary/5 text-primary transition-all">
            <HelpCircle className="w-3.5 h-3.5 text-primary/60" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Help</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="cursor-pointer relative p-2 rounded-none border border-primary/15 hover:bg-primary/5 transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-primary" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[8px] font-bold bg-red-500 text-white rounded-none border border-white animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
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
              className="cursor-pointer flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-none border border-primary/15 hover:bg-primary/5 transition-all"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-none border border-primary/20 object-cover"
                />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-none border border-white"></div>
              </div>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{user.name}</span>
                <span className="text-[9px] text-primary/45 font-serif italic mt-0.5">{user.email}</span>
              </div>
              <ChevronDown className="hidden lg:block w-3.5 h-3.5 text-primary/40" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-none border border-primary/25 shadow-xl overflow-hidden z-50 animate-slideDown font-inter">
                <div className="p-4 border-b border-primary/15">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-none border border-primary/20"
                    />
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">{user.name}</p>
                      <p className="text-[10px] text-primary/45 font-serif italic">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <button className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary/70 hover:bg-primary/5 transition-colors">
                    <User className="w-3.5 h-3.5 text-primary/40" />
                    <span>Profile</span>
                  </button>
                  <button className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary/70 hover:bg-primary/5 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5 text-primary/40" />
                    <span>Messages</span>
                    <span className="ml-auto text-[9px] font-bold tracking-widest bg-red-500 text-white px-2 py-0.5 rounded-none">3</span>
                  </button>
                  <button className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary/70 hover:bg-primary/5 transition-colors">
                    <Settings className="w-3.5 h-3.5 text-primary/40" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="border-t border-primary/15 py-1">
                  <button className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50/50 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
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
        <div className="md:hidden p-4 border-t border-primary/15 bg-white animate-slideDown">
          <form onSubmit={handleSearch} className="flex items-center bg-primary/[0.01] rounded-none px-3 py-2 border border-primary/20">
            <Search className="w-4 h-4 text-primary/40 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-xs font-serif italic text-primary flex-1"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="cursor-pointer p-1 mr-2"
              >
                <X className="w-3 h-3 text-primary/60" />
              </button>
            )}
            <button 
              type="button"
              onClick={() => setIsSearchOpen(false)} 
              className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-primary/50 px-2.5 py-1 hover:bg-primary/5 rounded-none transition-all"
            >
              Cancel
            </button>
          </form>
          
          {/* Quick search suggestions */}
          <div className="mt-3.5 space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/45">Recent searches</p>
            <div className="flex flex-wrap gap-2">
              <button className="cursor-pointer text-[10px] px-2.5 py-1 bg-primary/5 border border-primary/10 text-primary rounded-none hover:bg-primary/10 transition-colors font-medium">
                Atomic Habits
              </button>
              <button className="cursor-pointer text-[10px] px-2.5 py-1 bg-primary/5 border border-primary/10 text-primary rounded-none hover:bg-primary/10 transition-colors font-medium">
                John Doe
              </button>
              <button className="cursor-pointer text-[10px] px-2.5 py-1 bg-primary/5 border border-primary/10 text-primary rounded-none hover:bg-primary/10 transition-colors font-medium">
                Fiction
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
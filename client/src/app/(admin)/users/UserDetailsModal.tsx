"use client";

import { X, Mail, User, Calendar, BookOpen, Users, Globe, CheckCircle, XCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  isLoggedIn: boolean;
  profilePicture?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  books?: any[];
  blogs?: any[];
  interests?: string[];
  socialLinks?: string[];
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  const roleColor = (role: string) => {
    switch (role) {
      case "author": return "border-secondary text-secondary";
      case "admin": return "border-red-500 text-red-600";
      default: return "border-primary/30 text-primary/60";
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-primary/10 scrollbar-hide">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-primary/10 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">Account</p>
            <h2 className="text-2xl font-serif font-bold text-[#0A192F]">User Details</h2>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center border border-primary/20 text-primary/40 hover:text-primary hover:border-primary transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8 space-y-8">

          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 border border-primary/10 overflow-hidden shrink-0">
              <img
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0A192F&color=fff&size=128`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-[#0A192F]">{user.name}</h3>
              <p className="text-sm font-sans italic text-primary/50">@{user.username}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className={`px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest border ${roleColor(user.role)}`}>
                  {user.role}
                </span>
                <span className={`px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest border flex items-center gap-1.5 ${
                  user.isEmailVerified ? "border-green-500 text-green-700" : "border-orange-400 text-orange-600"
                }`}>
                  {user.isEmailVerified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {user.isEmailVerified ? "Verified" : "Unverified"}
                </span>
                {user.isLoggedIn && (
                  <span className="px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest border border-green-500 text-green-700">
                    Online
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Contact Information
            </p>
            <div className="border border-primary/10 bg-zinc-50 p-5">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary/30 shrink-0" />
                <span className="font-sans italic text-primary/70">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-2">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
              <Users className="w-3 h-3" /> Statistics
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Books", value: user.books?.length || 0 },
                { label: "Blogs", value: user.blogs?.length || 0 },
                { label: "Followers", value: user.followersCount || 0 },
                { label: "Following", value: user.followingCount || 0 },
              ].map((stat) => (
                <div key={stat.label} className="border border-primary/10 bg-zinc-50 p-4">
                  <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">{stat.label}</p>
                  <p className="text-2xl font-serif font-bold text-[#0A192F]">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="space-y-2">
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">Bio</p>
              <div className="border border-primary/10 bg-zinc-50 p-5">
                <p className="text-sm font-sans text-primary/80 leading-relaxed">{user.bio}</p>
              </div>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">Interests</p>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1.5 border border-primary/10 text-[10px] font-sans font-bold uppercase tracking-widest text-primary/60">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {user.socialLinks && user.socialLinks.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
                <Globe className="w-3 h-3" /> Social Links
              </p>
              <div className="border border-primary/10 bg-zinc-50 p-5 space-y-2">
                {user.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-sans italic text-primary/60 hover:text-primary transition-colors block underline underline-offset-4"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Account Timeline */}
          <div className="space-y-2">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Account Information
            </p>
            <div className="border border-primary/10 bg-zinc-50 p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary/40">Joined</span>
                <span className="text-sm font-sans text-[#0A192F]">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="h-px bg-primary/5" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary/40">Last Updated</span>
                <span className="text-sm font-sans text-[#0A192F]">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
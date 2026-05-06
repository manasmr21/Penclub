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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary/30 font-inter">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-primary/20 p-6 flex items-center justify-between z-10">
          <h2 className="text-lg font-serif font-bold text-primary uppercase tracking-widest">User Details</h2>
          <button 
            onClick={onClose} 
            className="cursor-pointer p-2 hover:bg-primary/5 border border-transparent hover:border-primary/10 rounded-none transition-all"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-primary/10 pb-6">
            <img
              src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=0D387D&color=fff&size=128`}
              alt={user.name}
              className="w-24 h-24 rounded-none object-cover border border-primary/20 shadow-sm"
            />
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-serif font-bold text-primary tracking-tight">{user.name}</h3>
              <p className="text-muted-foreground font-serif italic">@{user.username}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border ${
                   user.role === "author" ? "border-secondary/30 text-secondary bg-secondary/5" :
                   user.role === "admin" ? "border-red-600/30 text-red-600 bg-red-600/5" :
                   "border-primary/30 text-primary bg-primary/5"
                }`}>
                  {user.role}
                </span>
                <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${
                  user.isEmailVerified ? "border-green-600/30 text-green-600 bg-green-500/5" : "border-orange-600/30 text-orange-600 bg-orange-500/5"
                }`}>
                  {user.isEmailVerified ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {user.isEmailVerified ? "Verified" : "Unverified"}
                </span>
                {user.isLoggedIn && (
                  <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border border-green-600/30 text-green-600 bg-green-500/5">
                    Online
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Information
            </h4>
            <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary/40" />
                <span className="text-primary font-serif italic select-all">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15">
                <p className="text-[9px] font-bold uppercase tracking-wider text-primary/40 mb-1">Books</p>
                <p className="text-xl font-serif font-bold text-primary">{user.books?.length || 0}</p>
              </div>
              <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15">
                <p className="text-[9px] font-bold uppercase tracking-wider text-primary/40 mb-1">Blogs</p>
                <p className="text-xl font-serif font-bold text-primary">{user.blogs?.length || 0}</p>
              </div>
              <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15">
                <p className="text-[9px] font-bold uppercase tracking-wider text-primary/40 mb-1">Followers</p>
                <p className="text-xl font-serif font-bold text-primary">{user.followersCount || 0}</p>
              </div>
              <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15">
                <p className="text-[9px] font-bold uppercase tracking-wider text-primary/40 mb-1">Following</p>
                <p className="text-xl font-serif font-bold text-primary">{user.followingCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">Biography</h4>
              <p className="text-sm font-serif italic text-primary/80 leading-relaxed border-l-2 border-primary/20 pl-3">
                "{user.bio}"
              </p>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs border border-primary/20 bg-primary/5 text-primary rounded-none font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {user.socialLinks && user.socialLinks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Social Profiles
              </h4>
              <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15 space-y-2">
                {user.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-secondary hover:text-primary transition-colors block font-serif italic hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Account Ledger
            </h4>
            <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15 space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-primary/5 pb-2">
                <span className="text-primary/40 font-bold uppercase tracking-wider text-[9px]">Date Joined</span>
                <span className="text-primary font-serif italic">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-primary/40 font-bold uppercase tracking-wider text-[9px]">Last Profile Update</span>
                <span className="text-primary font-serif italic">
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
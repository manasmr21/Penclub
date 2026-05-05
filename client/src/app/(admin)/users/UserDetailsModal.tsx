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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border/20">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-primary tracking-tight">User Details</h2>
          <button 
            onClick={onClose} 
            className="cursor-pointer p-2 hover:bg-background rounded-full transition-all"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <img
              src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=0d387d&color=fff&size=128`}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
            />
            <div>
              <h3 className="text-2xl font-bold text-primary tracking-tight">{user.name}</h3>
              <p className="text-muted-foreground font-serif italic">@{user.username}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                   user.role === "author" ? "bg-secondary/10 text-secondary" :
                   user.role === "admin" ? "bg-red-100 text-red-700" :
                   "bg-primary/10 text-primary"
                }`}>
                  {user.role}
                </span>
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 ${
                  user.isEmailVerified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                }`}>
                  {user.isEmailVerified ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {user.isEmailVerified ? "Verified" : "Unverified"}
                </span>
                {user.isLoggedIn && (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-green-100 text-green-700">
                    Online
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Information
            </h4>
            <div className="bg-background rounded-2xl p-4 border border-border/20 shadow-sm">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary/40" />
                <span className="text-muted-foreground font-serif italic">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Users className="w-4 h-4" />
              Statistics
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background rounded-2xl p-4 border border-border/20 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">Books</p>
                <p className="text-xl font-bold text-primary">{user.books?.length || 0}</p>
              </div>
              <div className="bg-background rounded-2xl p-4 border border-border/20 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">Blogs</p>
                <p className="text-xl font-bold text-primary">{user.blogs?.length || 0}</p>
              </div>
              <div className="bg-background rounded-2xl p-4 border border-border/20 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">Followers</p>
                <p className="text-xl font-bold text-primary">{user.followersCount || 0}</p>
              </div>
              <div className="bg-background rounded-2xl p-4 border border-border/20 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">Following</p>
                <p className="text-xl font-bold text-primary">{user.followingCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Bio</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {user.socialLinks && user.socialLinks.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Social Links
              </h4>
              <div className="bg-background rounded-2xl p-4 border border-border/20 shadow-sm space-y-2">
                {user.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-secondary hover:text-primary transition-colors block font-serif italic"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Account Information
            </h4>
            <div className="bg-background rounded-2xl p-4 border border-border/20 shadow-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground/60 font-bold uppercase tracking-tighter text-[10px]">Joined</span>
                <span className="text-primary font-serif italic">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground/60 font-bold uppercase tracking-tighter text-[10px]">Last Updated</span>
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
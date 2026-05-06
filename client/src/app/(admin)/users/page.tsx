"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, UserCheck, UserX, Eye, Users, Shield, BookOpen } from "lucide-react";
import { UserDetailsModal } from "./UserDetailsModal";
import { StatCard } from "@/src/components/cards";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  isLoggedIn: boolean;
  isEmailVerified?: boolean;
  profilePicture?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  books?: any[];
  blogs?: any[];
  interests?: string[];
  socialLinks?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Mock data
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    role: "author",
    isLoggedIn: true,
    isEmailVerified: true,
    profilePicture: null,
    bio: "Passionate writer and storyteller. Author of multiple best-selling novels.",
    followersCount: 1234,
    followingCount: 567,
    books: [{ id: "b1" }, { id: "b2" }],
    blogs: [{ id: "bl1" }],
    interests: ["Fiction", "Fantasy", "Sci-Fi"],
    socialLinks: ["https://twitter.com/johndoe", "https://github.com/johndoe"],
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-03-20").toISOString()
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    username: "janesmith",
    role: "reader",
    isLoggedIn: true,
    isEmailVerified: true,
    profilePicture: null,
    bio: "Avid reader and book reviewer",
    followersCount: 456,
    followingCount: 789,
    books: [],
    blogs: [],
    interests: ["Romance", "Mystery", "Thriller"],
    socialLinks: [],
    createdAt: new Date("2024-02-01").toISOString(),
    updatedAt: new Date("2024-03-18").toISOString()
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@penclub.com",
    username: "admin",
    role: "admin",
    isLoggedIn: true,
    isEmailVerified: true,
    profilePicture: null,
    bio: "Platform Administrator",
    followersCount: 999,
    followingCount: 100,
    books: [],
    blogs: [],
    interests: ["Management", "Technology"],
    socialLinks: [],
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-03-15").toISOString()
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    username: "sarahj",
    role: "author",
    isLoggedIn: false,
    isEmailVerified: false,
    profilePicture: null,
    bio: "Poet and creative writer",
    followersCount: 2345,
    followingCount: 234,
    books: [{ id: "b3" }],
    blogs: [{ id: "bl2" }, { id: "bl3" }],
    interests: ["Poetry", "Drama"],
    socialLinks: ["https://instagram.com/sarahj"],
    createdAt: new Date("2024-02-20").toISOString(),
    updatedAt: new Date("2024-03-10").toISOString()
  },
  {
    id: "5",
    name: "Mike Wilson",
    email: "mike@example.com",
    username: "mikew",
    role: "reader",
    isLoggedIn: true,
    isEmailVerified: true,
    profilePicture: null,
    bio: "Tech enthusiast and book lover",
    followersCount: 789,
    followingCount: 345,
    books: [],
    blogs: [],
    interests: ["Technology", "Science Fiction"],
    socialLinks: ["https://twitter.com/mikew"],
    createdAt: new Date("2024-03-01").toISOString(),
    updatedAt: new Date("2024-03-25").toISOString()
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Filter users
  useEffect(() => {
    let filtered = [...users];
    
    if (activeTab === "authors") {
      filtered = filtered.filter(user => user.role === "author");
    } else if (activeTab === "readers") {
      filtered = filtered.filter(user => user.role === "reader");
    } else if (activeTab === "admins") {
      filtered = filtered.filter(user => user.role === "admin");
    }
    
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
  }, [activeTab, searchTerm, users]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isLoggedIn: !user.isLoggedIn } : user
    ));
  };

  const handlePreview = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const stats = {
    total: users.length,
    authors: users.filter(u => u.role === "author").length,
    readers: users.filter(u => u.role === "reader").length,
    admins: users.filter(u => u.role === "admin").length
  };

  return (
    <>
      <div className="pt-2 px-8 pb-8 space-y-8 font-inter">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-primary/20 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
              Members Directory
            </span>
            <h1 className="text-3xl font-serif font-bold text-primary mt-1 tracking-tight">Users Management</h1>
            <p className="text-xs text-muted-foreground mt-1.5 font-serif italic">Manage authors, readers, and administrators</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.total.toString()}
            icon={Users}
            theme="blue"
          />
          <StatCard
            title="Authors"
            value={stats.authors.toString()}
            icon={BookOpen}
            theme="purple"
          />
          <StatCard
            title="Readers"
            value={stats.readers.toString()}
            icon={Users}
            theme="ocean"
          />
          <StatCard
            title="Admins"
            value={stats.admins.toString()}
            icon={Shield}
            theme="coral"
          />
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-primary/10 pb-4">
          <div className="flex flex-wrap gap-4">
            {["all", "authors", "readers", "admins"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  activeTab === tab 
                    ? "bg-primary text-white border-primary" 
                    : "border-primary/15 text-primary/60 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {tab === "all" ? "All Users" : tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary transition-all text-sm font-serif italic"
            />
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-primary/20 bg-primary/[0.01]">
            <p className="text-sm font-serif italic text-primary/50">No users found match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-card border border-primary/15 rounded-none p-6 hover:border-primary/40 hover:bg-primary/[0.01] transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=0D387D&color=fff`}
                      alt={user.name}
                      className="w-14 h-14 rounded-none border border-primary/20 object-cover"
                    />
                    {user.isLoggedIn && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-white"></div>
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="font-bold text-primary group-hover:text-secondary transition-colors text-sm truncate">{user.name}</h3>
                      <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest border ${
                        user.role === "author" ? "border-secondary/30 text-secondary bg-secondary/5" :
                        user.role === "admin" ? "border-red-600/30 text-red-600 bg-red-500/5" :
                        "border-primary/30 text-primary bg-primary/5"
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-serif italic">{user.email}</p>
                    <p className="text-[10px] text-primary/45 font-bold uppercase tracking-wider mt-0.5">@{user.username}</p>
                    {user.bio && (
                      <p className="text-xs text-primary/70 font-serif italic mt-2 line-clamp-2 leading-relaxed border-l-2 border-primary/10 pl-2">
                        "{user.bio}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2.5 mt-6 pt-4 border-t border-primary/10 justify-end">
                  {/* Preview Button */}
                  <button
                    onClick={() => handlePreview(user)}
                    className="cursor-pointer p-2 hover:bg-primary hover:text-white text-primary border border-primary/20 rounded-none transition-all"
                    title="Preview user details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className="cursor-pointer p-2 hover:bg-primary hover:text-white text-primary border border-primary/20 rounded-none transition-all"
                    title={user.isLoggedIn ? "Block user" : "Activate user"}
                  >
                    {user.isLoggedIn ? (
                      <UserX className="w-4 h-4 text-red-600" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-green-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="cursor-pointer p-2 hover:bg-red-600 hover:text-white hover:border-red-600 text-primary border border-primary/20 rounded-none transition-all"
                    title="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
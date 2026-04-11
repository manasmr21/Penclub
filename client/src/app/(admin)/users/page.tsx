"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, UserCheck, UserX, Eye } from "lucide-react";
import { UserDetailsModal } from "./UserDetailsModal";

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
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage authors, readers, and administrators</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">Authors</p>
            <p className="text-2xl font-bold text-purple-600">{stats.authors}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">Readers</p>
            <p className="text-2xl font-bold text-green-600">{stats.readers}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "all" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab("authors")}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "authors" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Authors
            </button>
            <button
              onClick={() => setActiveTab("readers")}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "readers" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Readers
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "admins" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Admins
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 w-64"
            />
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {user.isLoggedIn && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.role === "author" ? "bg-purple-100 text-purple-700" :
                          user.role === "admin" ? "bg-red-100 text-red-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">@{user.username}</p>
                      {user.bio && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">{user.bio}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {/* Preview Button */}
                    <button
                      onClick={() => handlePreview(user)}
                      className="cursor-pointer p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Preview user details"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={user.isLoggedIn ? "Block user" : "Activate user"}
                    >
                      {user.isLoggedIn ? (
                        <UserX className="w-4 h-4 text-red-500" />
                      ) : (
                        <UserCheck className="w-4 h-4 text-green-500" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="cursor-pointer p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
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
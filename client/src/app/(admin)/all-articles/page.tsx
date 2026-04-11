"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  Download,
  Calendar,
  User,
  Tag,
  Heart,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  RefreshCw
} from "lucide-react";

interface Blog {
  id: string;
  title: string;
  content: string;
  tags: string[];
  coverImage: string | null;
  coverImageId: string | null;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  status: "posted" | "pending" | "draft" | "deleted" | "edited";
  likesCount: number;
  createdAt: Date;
  deletedAt: Date | null;
}

// Mock data
const MOCK_ARTICLES: Blog[] = [
  {
    id: "1",
    title: "The Future of Digital Publishing",
    content: "Digital publishing is evolving rapidly...",
    tags: ["publishing", "digital", "trends"],
    coverImage: "https://images.unsplash.com/photo-1456327102063-fb5054efe647?w=400",
    coverImageId: "cover1",
    userId: "1",
    user: { id: "1", name: "John Doe", email: "john@example.com" },
    status: "posted",
    likesCount: 234,
    createdAt: new Date("2024-03-15"),
    deletedAt: null
  },
  {
    id: "2",
    title: "10 Tips for Aspiring Authors",
    content: "Writing a book is a journey...",
    tags: ["writing", "authors", "tips"],
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
    coverImageId: "cover2",
    userId: "2",
    user: { id: "2", name: "Jane Smith", email: "jane@example.com" },
    status: "posted",
    likesCount: 567,
    createdAt: new Date("2024-03-10"),
    deletedAt: null
  },
  {
    id: "3",
    title: "Understanding Book Genres",
    content: "A comprehensive guide to book genres...",
    tags: ["genres", "books", "guide"],
    coverImage: null,
    coverImageId: null,
    userId: "4",
    user: { id: "4", name: "Sarah Johnson", email: "sarah@example.com" },
    status: "pending",
    likesCount: 0,
    createdAt: new Date("2024-03-18"),
    deletedAt: null
  },
  {
    id: "4",
    title: "Marketing Your First Book",
    content: "Essential marketing strategies...",
    tags: ["marketing", "promotion", "books"],
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    coverImageId: "cover4",
    userId: "1",
    user: { id: "1", name: "John Doe", email: "john@example.com" },
    status: "draft",
    likesCount: 0,
    createdAt: new Date("2024-03-20"),
    deletedAt: null
  },
  {
    id: "5",
    title: "The Rise of Audiobooks",
    content: "How audiobooks are changing reading habits...",
    tags: ["audiobooks", "trends", "technology"],
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400",
    coverImageId: "cover5",
    userId: "5",
    user: { id: "5", name: "Mike Wilson", email: "mike@example.com" },
    status: "edited",
    likesCount: 89,
    createdAt: new Date("2024-03-05"),
    deletedAt: null
  }
];

// Article Details Modal
function ArticleDetailsModal({ article, onClose }: { article: Blog | null; onClose: () => void }) {
  if (!article) return null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case "posted": return "text-green-700 bg-green-100";
      case "pending": return "text-yellow-700 bg-yellow-100";
      case "draft": return "text-gray-700 bg-gray-100";
      case "edited": return "text-blue-700 bg-blue-100";
      case "deleted": return "text-red-700 bg-red-100";
      default: return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "posted": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "draft": return <FileText className="w-4 h-4" />;
      case "edited": return <Edit className="w-4 h-4" />;
      case "deleted": return <Trash2 className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Article Details</h2>
          <button onClick={onClose} className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Cover Image */}
          {article.coverImage && (
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          {/* Title and Status */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{article.title}</h3>
              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(article.status)}`}>
                {getStatusIcon(article.status)}
                {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{article.user?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{article.likesCount} likes</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Content</h4>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">{article.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Blog[]>(MOCK_ARTICLES);
  const [filteredArticles, setFilteredArticles] = useState<Blog[]>(MOCK_ARTICLES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Blog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    let filtered = [...articles];
    
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        article.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(article => article.status === statusFilter);
    }
    
    setFilteredArticles(filtered);
  }, [searchTerm, statusFilter, articles]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const handleView = (article: Blog) => {
    setSelectedArticle(article);
    setShowDetailsModal(true);
  };

  const stats = {
    total: articles.length,
    posted: articles.filter(a => a.status === "posted").length,
    pending: articles.filter(a => a.status === "pending").length,
    draft: articles.filter(a => a.status === "draft").length,
    edited: articles.filter(a => a.status === "edited").length,
    totalLikes: articles.reduce((sum, a) => sum + a.likesCount, 0)
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "posted": return "text-green-700 bg-green-100";
      case "pending": return "text-yellow-700 bg-yellow-100";
      case "draft": return "text-gray-700 bg-gray-100";
      case "edited": return "text-blue-700 bg-blue-100";
      case "deleted": return "text-red-700 bg-red-100";
      default: return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
            <p className="text-gray-500 text-sm mt-1">Manage blog articles and posts</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              New Article
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Articles</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">Published</p>
            <p className="text-2xl font-bold text-green-600">{stats.posted}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">Drafts</p>
            <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Likes</p>
            <p className="text-2xl font-bold text-red-600">{stats.totalLikes}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles by title, content, tags, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Status</option>
              <option value="posted">Published</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
              <option value="edited">Edited</option>
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or create a new article</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 transition-all flex flex-col">
                {/* Article Image */}
                {article.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(article.status)}`}>
                        {article.status}
                      </span>
                    </div>
                  </div>
                )}

                {!article.coverImage && (
                  <div className="relative h-32 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-300" />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(article.status)}`}>
                        {article.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Article Content */}
                <div className="p-4 flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{article.content}</p>
                  
                  {/* Tags */}
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{article.user?.name || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{article.likesCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 pt-0 mt-auto border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleView(article)}
                      className="cursor-pointer flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {}}
                      className="cursor-pointer flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-50 hover:bg-yellow-50 text-gray-600 hover:text-yellow-600 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="cursor-pointer flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Article Details Modal */}
      {showDetailsModal && (
        <ArticleDetailsModal
          article={selectedArticle}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
}
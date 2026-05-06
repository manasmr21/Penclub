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
  CheckCircle,
  Clock,
  FileText,
  RefreshCw
} from "lucide-react";
import { StatCard } from "@/src/components/cards";
import { StatCardSkeleton, ArticleCardSkeleton } from "@/src/components/Skeleton";
import { Blog, MOCK_ARTICLES } from "@/src/utils/dummyData/dummyData";


// Article Details Modal
function ArticleDetailsModal({ article, onClose }: { article: Blog | null; onClose: () => void }) {
  if (!article) return null;

<<<<<<< HEAD
  const getStatusColor = (status: string) => {
    switch(status) {
      case "posted": return "border-green-600 text-green-700";
      case "pending": return "border-yellow-500 text-yellow-700";
      case "draft": return "border-primary/20 text-primary/50";
      case "edited": return "border-blue-500 text-blue-700";
      case "deleted": return "border-red-500 text-red-700";
      default: return "border-primary/20 text-primary/40";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "posted": return <CheckCircle className="w-3 h-3" />;
      case "pending": return <Clock className="w-3 h-3" />;
      case "draft": return <FileText className="w-3 h-3" />;
      case "edited": return <Edit className="w-3 h-3" />;
      case "deleted": return <Trash2 className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-primary/10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-primary/10 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">Article</p>
            <h2 className="text-2xl font-serif font-bold text-[#0A192F]">Article Details</h2>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center border border-primary/20 text-primary/40 hover:text-primary hover:border-primary transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
=======
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card rounded-none max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary/30 font-inter">
        <div className="sticky top-0 bg-white border-b border-primary/20 p-6 flex items-center justify-between z-10">
          <h2 className="text-lg font-serif font-bold text-primary uppercase tracking-widest">Article Details</h2>
          <button 
            onClick={onClose} 
            className="cursor-pointer p-2 hover:bg-primary/5 border border-transparent hover:border-primary/10 rounded-none transition-all"
          >
            <X className="w-5 h-5 text-primary" />
>>>>>>> c925529b424592087f1d1eb7f565490ef3cd21cb
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Cover Image */}
          {article.coverImage && (
<<<<<<< HEAD
            <div className="border border-primary/10 overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-56 object-cover"
              />
            </div>
          )}

          {/* Title and Status */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 flex-wrap">
              <h3 className="text-2xl font-serif font-bold text-[#0A192F] flex-1">{article.title}</h3>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest border ${getStatusColor(article.status)} shrink-0`}>
                {getStatusIcon(article.status)}
                {article.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-[10px] font-sans font-bold uppercase tracking-widest text-primary/40">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>{article.user?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                <span>{article.likesCount} likes</span>
=======
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-64 object-cover rounded-none border border-primary/25 shadow-sm"
            />
          )}

          {/* Title and Status */}
          <div className="border-b border-primary/10 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-2xl font-serif font-bold text-primary tracking-tight leading-tight">{article.title}</h3>
              <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border self-start ${
                article.status === "posted" ? "border-green-600/30 text-green-600 bg-green-500/5" :
                article.status === "pending" ? "border-orange-600/30 text-orange-600 bg-orange-500/5" :
                article.status === "edited" ? "border-secondary/30 text-secondary bg-secondary/5" :
                "border-primary/30 text-primary bg-primary/5"
              }`}>
                {article.status}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-xs text-primary/60">
              <div className="flex items-center gap-1.5 font-serif italic">
                <User className="w-4 h-4 text-primary/40" />
                <span>{article.user?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-1.5 font-serif italic">
                <Calendar className="w-4 h-4 text-primary/40" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-500 fill-red-500/10" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary/50">{article.likesCount} likes</span>
>>>>>>> c925529b424592087f1d1eb7f565490ef3cd21cb
              </div>
            </div>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="space-y-2">
<<<<<<< HEAD
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
                <Tag className="w-3 h-3" /> Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 border border-primary/10 text-[10px] font-sans font-bold uppercase tracking-widest text-primary/60">
=======
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs border border-primary/20 bg-primary/5 text-primary rounded-none font-medium">
>>>>>>> c925529b424592087f1d1eb7f565490ef3cd21cb
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
<<<<<<< HEAD
          <div className="space-y-2">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">Content</p>
            <div className="border border-primary/10 bg-zinc-50 p-5">
              <p className="text-sm font-sans text-primary/80 leading-relaxed">{article.content}</p>
=======
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">Content</h4>
            <div className="bg-primary/[0.01] rounded-none p-5 border border-primary/15 leading-relaxed text-sm font-serif italic text-primary/80">
              <p className="whitespace-pre-line leading-relaxed">"{article.content}"</p>
>>>>>>> c925529b424592087f1d1eb7f565490ef3cd21cb
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ArticlesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Blog[]>(MOCK_ARTICLES);
  const [filteredArticles, setFilteredArticles] = useState<Blog[]>(MOCK_ARTICLES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Blog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const getCardStatusBorder = (status: string) => {
    switch(status) {
      case "posted": return "border-l-4 border-l-green-500/70";
      case "pending": return "border-l-4 border-l-orange-500/70";
      case "draft": return "border-l-4 border-l-gold-500/70";
      default: return "";
    }
  };

  return (
    <>
      <div className="pt-2 px-8 pb-8 space-y-8 font-inter">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-primary/20 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
              Editorial Ledger
            </span>
            <h1 className="text-3xl font-serif font-bold text-primary mt-1 tracking-tight">Articles</h1>
            <p className="text-xs text-muted-foreground mt-1.5 font-serif italic">Manage blog articles and literary posts</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary bg-white border border-primary/20 rounded-none hover:bg-primary/5 transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="cursor-pointer flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-primary border border-primary rounded-none hover:opacity-90 transition-all">
              <Plus className="w-4 h-4" />
              New Article
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-fadeIn">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-fadeIn">
            <StatCard
              title="Total Articles"
              value={stats.total.toString()}
              icon={FileText}
              theme="blue"
            />
            <StatCard
              title="Published"
              value={stats.posted.toString()}
              icon={CheckCircle}
              theme="green"
            />
            <StatCard
              title="Pending"
              value={stats.pending.toString()}
              icon={Clock}
              theme="ocean"
            />
            <StatCard
              title="Drafts"
              value={stats.draft.toString()}
              icon={FileText}
              theme="gold"
            />
            <StatCard
              title="Total Likes"
              value={stats.totalLikes.toString()}
              icon={Heart}
              theme="coral"
            />
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary transition-all text-sm font-serif italic"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-primary/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary transition-all text-xs font-bold uppercase tracking-wider text-primary cursor-pointer"
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
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 animate-fadeIn">
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-primary/20 bg-primary/[0.01]">
            <FileText className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-primary uppercase tracking-widest">No articles found</h3>
            <p className="text-xs text-muted-foreground font-serif italic mt-1">Try adjusting your search or create a new article</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 animate-fadeIn">
            {filteredArticles.map((article) => (
              <div key={article.id} className={`bg-card border border-primary/15 rounded-none overflow-hidden hover:border-primary/40 hover:bg-primary/[0.01] transition-all duration-300 flex flex-col group ${getCardStatusBorder(article.status)}`}>
                {/* Article Image */}
                {article.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                        article.status === "posted" ? "border-green-600/30 text-green-600 bg-white" :
                        article.status === "pending" ? "border-orange-600/30 text-orange-600 bg-white" :
                        "border-primary/20 text-primary bg-white"
                      }`}>
                        {article.status}
                      </span>
                    </div>
                  </div>
                )}

                {!article.coverImage && (
                  <div className="relative h-32 bg-primary/5 border-b border-primary/10 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-primary/30 animate-pulse" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                        article.status === "posted" ? "border-green-600/30 text-green-600 bg-white" :
                        article.status === "pending" ? "border-orange-600/30 text-orange-600 bg-white" :
                        "border-primary/20 text-primary bg-white"
                      }`}>
                        {article.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Article Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-tight">{article.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-2 font-serif italic leading-relaxed">"{article.content}"</p>
                    
                    {/* Tags */}
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-medium px-2 py-0.5 border border-primary/10 bg-primary/5 text-primary rounded-none">
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-[10px] font-medium px-2 py-0.5 border border-primary/10 bg-primary/5 text-primary rounded-none">
                            +{article.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-[10px] text-primary/60 border-t border-primary/5 pt-4 mt-6">
                    <div className="flex items-center gap-1 font-serif italic">
                      <User className="w-3.5 h-3.5 text-primary/40" />
                      <span>{article.user?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-1 font-serif italic">
                      <Calendar className="w-3.5 h-3.5 text-primary/40" />
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/10" />
                      <span className="font-bold uppercase tracking-wider text-[9px]">{article.likesCount}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6 pt-0 mt-auto">
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      onClick={() => handleView(article)}
                      className="cursor-pointer flex items-center justify-center gap-1.5 py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white text-primary border border-primary/20 rounded-none transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {}}
                      className="cursor-pointer flex items-center justify-center gap-1.5 py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white text-primary border border-primary/20 rounded-none transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="cursor-pointer flex items-center justify-center gap-1.5 py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 text-primary border border-primary/20 rounded-none transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
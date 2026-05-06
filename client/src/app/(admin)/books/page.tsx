"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  Eye, 
  Plus, 
  Edit, 
  X,
  Download,
  Filter,
  BookOpen,
  Heart,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { StatCard } from "@/src/components/cards";
import { StatCardSkeleton, BookCardSkeleton } from "@/src/components/Skeleton";
import { Book, MOCK_BOOKS } from "@/src/utils/dummyData/dummyData";


// Book Details Modal
function BookDetailsModal({ book, onClose }: { book: Book | null; onClose: () => void }) {
  if (!book) return null;

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-primary/10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-primary/10 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">Library</p>
            <h2 className="text-2xl font-serif font-bold text-[#0A192F]">Book Details</h2>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center border border-primary/20 text-primary/40 hover:text-primary hover:border-primary transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-serif font-bold text-[#0A192F]">{book.title}</h3>
            <p className="text-sm font-sans italic text-primary/60 mt-1">by {book.author?.name}</p>
          </div>
          <p className="text-sm font-sans text-primary/80 leading-relaxed">{book.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-primary/10 bg-zinc-50 p-4">
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">Genre</p>
              <p className="font-sans font-bold text-[#0A192F]">{book.genre}</p>
            </div>
            <div className="border border-primary/10 bg-zinc-50 p-4">
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">Release Date</p>
              <p className="font-sans font-bold text-[#0A192F]">{new Date(book.releaseDate).toLocaleDateString()}</p>
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary/30 font-inter">
        <div className="sticky top-0 bg-white border-b border-primary/20 p-6 flex items-center justify-between z-10">
          <h2 className="text-lg font-serif font-bold text-primary uppercase tracking-widest">Book Details</h2>
          <button 
            onClick={onClose} 
            className="cursor-pointer p-2 hover:bg-primary/5 border border-transparent hover:border-primary/10 rounded-none transition-all"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-primary/10 pb-6">
            {book.images[0] && (
              <img
                src={book.images[0].url}
                alt={book.title}
                className="w-28 h-36 rounded-none object-cover border border-primary/20 shadow-sm"
              />
            )}
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-serif font-bold text-primary tracking-tight">{book.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 font-serif italic">by {book.author?.name || "Unknown"}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border ${
                  book.state === "approved" ? "border-green-600/30 text-green-600 bg-green-500/5" :
                  book.state === "pending" ? "border-orange-600/30 text-orange-600 bg-orange-500/5" :
                  "border-red-600/30 text-red-600 bg-red-600/5"
                }`}>
                  {book.state}
                </span>
                {book.isAdvertised && (
                  <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border border-secondary/30 text-secondary bg-secondary/5">
                    Advertised
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">Synopsis</h4>
            <p className="text-sm font-serif italic text-primary/80 leading-relaxed border-l-2 border-primary/20 pl-3">
              "{book.description}"
            </p>
          </div>

          {/* Details Metadata */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">Book Ledger</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15">
                <p className="text-[9px] font-bold uppercase tracking-wider text-primary/40 mb-1">Genre</p>
                <p className="text-sm font-serif font-bold text-primary">{book.genre}</p>
              </div>
              <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15">
                <p className="text-[9px] font-bold uppercase tracking-wider text-primary/40 mb-1">Release Date</p>
                <p className="text-sm font-serif font-bold text-primary">
                  {new Date(book.releaseDate).toLocaleDateString()}
                </p>
              </div>
>>>>>>> c925529b424592087f1d1eb7f565490ef3cd21cb
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function BooksPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(MOCK_BOOKS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...books];
    
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(book => book.state === statusFilter);
    }
    
    setFilteredBooks(filtered);
  }, [searchTerm, statusFilter, books]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter(b => b.id !== id));
    }
  };

  const handleView = (book: Book) => {
    setSelectedBook(book);
    setShowDetailsModal(true);
  };

  const stats = {
    total: books.length,
    approved: books.filter(b => b.state === "approved").length,
    pending: books.filter(b => b.state === "pending").length,
    notApproved: books.filter(b => b.state === "not_approved").length,
  };

  const getStatusColor = (state: string) => {
    switch(state) {
      case "approved": return "border-green-600/30 text-green-600 bg-green-500/5";
      case "pending": return "border-orange-600/30 text-orange-600 bg-orange-500/5";
      case "not_approved": return "border-red-600/30 text-red-600 bg-red-600/5";
      default: return "border-primary/20 text-primary bg-primary/5";
    }
  };

  const getCardStatusBorder = (state: string) => {
    switch(state) {
      case "approved": return "border-l-4 border-l-green-500/70";
      case "pending": return "border-l-4 border-l-orange-500/70";
      case "not_approved": return "border-l-4 border-l-red-500/70";
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
              Publications Catalogue
            </span>
            <h1 className="text-3xl font-serif font-bold text-primary mt-1 tracking-tight">Books</h1>
            <p className="text-xs text-muted-foreground mt-1.5 font-serif italic">Manage all literary works in the platform</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary bg-white border border-primary/20 rounded-none hover:bg-primary/5 transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="cursor-pointer flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-primary border border-primary rounded-none hover:opacity-90 transition-all">
              <Plus className="w-4 h-4" />
              Add Book
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            <StatCard
              title="Total Books"
              value={stats.total.toString()}
              icon={BookOpen}
              theme="blue"
            />
            <StatCard
              title="Approved"
              value={stats.approved.toString()}
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
              title="Not Approved"
              value={stats.notApproved.toString()}
              icon={XCircle}
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
              placeholder="Search books..."
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
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="not_approved">Not Approved</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 animate-fadeIn">
            <BookCardSkeleton />
            <BookCardSkeleton />
            <BookCardSkeleton />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-primary/20 bg-primary/[0.01]">
            <BookOpen className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-primary uppercase tracking-widest">No books found</h3>
            <p className="text-xs text-muted-foreground font-serif italic mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 animate-fadeIn">
            {filteredBooks.map((book) => (
              <div key={book.id} className={`bg-card border border-primary/15 rounded-none overflow-hidden hover:border-primary/40 hover:bg-primary/[0.01] transition-all duration-300 flex flex-col group justify-between ${getCardStatusBorder(book.state)}`}>
                <div>
                  {/* Book Cover Section */}
                  <div className="flex gap-4 p-4 pb-2">
                    {book.images[0] && (
                      <img
                        src={book.images[0].url}
                        alt={book.title}
                        className="w-24 h-32 rounded-none object-cover border border-primary/20 shadow-sm flex-shrink-0 group-hover:scale-102 transition-transform"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-serif font-bold text-primary line-clamp-2 leading-tight group-hover:text-secondary transition-colors">{book.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 font-serif italic">by {book.author?.name || "Unknown"}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border inline-flex items-center gap-1 ${getStatusColor(book.state)}`}>
                          {book.state === "approved" && <CheckCircle className="w-3 h-3" />}
                          {book.state === "pending" && <Clock className="w-3 h-3" />}
                          {book.state === "not_approved" && <XCircle className="w-3 h-3" />}
                          {book.state}
                        </span>
                        {book.isAdvertised && (
                          <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-secondary/30 text-secondary bg-secondary/5 inline-flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Advertised
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-3.5">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/10" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary/50">{book.likesCount} likes</span>
                      </div>
                    </div>
                  </div>

                  {/* Genre and Release Date */}
                  <div className="px-4 pb-2 mt-2">
                    <div className="flex items-center justify-between text-[10px] text-primary/45 uppercase tracking-wider font-bold border-t border-primary/5 pt-2">
                      <span>Genre: {book.genre}</span>
                      <span>Released: {new Date(book.releaseDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 pt-0 mt-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      onClick={() => handleView(book)}
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
                      onClick={() => handleDelete(book.id)}
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

      {showDetailsModal && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
}
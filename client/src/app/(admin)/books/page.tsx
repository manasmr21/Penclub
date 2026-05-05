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

interface BookImage {
  url: string;
  publicId: string;
}

interface Book {
  id: string;
  title: string;
  images: BookImage[];
  description: string;
  genre: string;
  releaseDate: string;
  purchaseLinks: string[];
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  state: "pending" | "approved" | "not_approved";
  approved: boolean;
  isAdvertised: boolean;
  trial: string | null;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// Mock data
const MOCK_BOOKS: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    images: [{ url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200", publicId: "book1" }],
    description: "Between life and death there is a library.",
    genre: "Fiction",
    releaseDate: "2024-01-15",
    purchaseLinks: ["https://amazon.com/book1"],
    authorId: "1",
    author: { id: "1", name: "John Doe", email: "john@example.com" },
    state: "approved",
    approved: true,
    isAdvertised: true,
    trial: null,
    likesCount: 1234,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-20"),
    deletedAt: null
  },
  {
    id: "2",
    title: "Atomic Habits",
    images: [{ url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200", publicId: "book2" }],
    description: "No matter your goals, Atomic Habits offers a proven framework.",
    genre: "Self-Help",
    releaseDate: "2024-02-01",
    purchaseLinks: ["https://amazon.com/book2"],
    authorId: "2",
    author: { id: "2", name: "Jane Smith", email: "jane@example.com" },
    state: "approved",
    approved: true,
    isAdvertised: false,
    trial: null,
    likesCount: 2345,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-18"),
    deletedAt: null
  },
  {
    id: "3",
    title: "The Silent Patient",
    images: [{ url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200", publicId: "book3" }],
    description: "A shocking psychological thriller.",
    genre: "Thriller",
    releaseDate: "2024-01-20",
    purchaseLinks: ["https://amazon.com/book3"],
    authorId: "4",
    author: { id: "4", name: "Sarah Johnson", email: "sarah@example.com" },
    state: "pending",
    approved: false,
    isAdvertised: false,
    trial: "Chapter 1 preview available",
    likesCount: 567,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-03-10"),
    deletedAt: null
  }
];

// Book Details Modal
function BookDetailsModal({ book, onClose }: { book: Book | null; onClose: () => void }) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border/20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-primary tracking-tight">Book Details</h2>
          <button onClick={onClose} className="cursor-pointer p-2 hover:bg-background rounded-full transition-all">
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold">{book.title}</h3>
          <p className="text-gray-600">by {book.author?.name}</p>
          <p className="text-sm">{book.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Genre</p>
              <p className="font-medium">{book.genre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Release Date</p>
              <p className="font-medium">{new Date(book.releaseDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(MOCK_BOOKS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
      case "approved": return "text-green-700 bg-green-100";
      case "pending": return "text-yellow-700 bg-yellow-100";
      case "not_approved": return "text-red-700 bg-red-100";
      default: return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <>
      <div className="p-8 space-y-8 font-inter">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">Books</h1>
            <p className="text-muted-foreground text-sm mt-1 font-serif italic">Manage all literary works in the platform</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary bg-white border border-primary/20 rounded-full hover:bg-primary/5 transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="cursor-pointer flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-primary rounded-full hover:bg-primary/90 transition-all shadow-[0_4px_12px_rgba(13,56,125,0.2)]">
              <Plus className="w-4 h-4" />
              Add Book
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-border/40 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Books</p>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </div>
          <div className="bg-white border border-border/40 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white border border-border/40 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Pending</p>
            <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-white border border-border/40 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Not Approved</p>
            <p className="text-3xl font-bold text-red-600">{stats.notApproved}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-border/40 rounded-xl focus:outline-none focus:border-primary/40 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-primary/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-border/40 rounded-xl focus:outline-none focus:border-primary/40 transition-all text-sm font-medium text-primary cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="not_approved">Not Approved</option>
            </select>
          </div>
        </div>

        {/* Books Grid - Fixed button layout */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
            <p className="text-gray-500">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white border border-border/40 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
                {/* Book Cover Section */}
                <div className="flex gap-4 p-4 pb-2">
                  {book.images[0] && (
                    <img
                      src={book.images[0].url}
                      alt={book.title}
                      className="w-24 h-32 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-primary line-clamp-2 group-hover:text-secondary transition-colors">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-serif italic">by {book.author?.name || "Unknown"}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full inline-flex items-center gap-1 ${getStatusColor(book.state)}`}>
                        {book.state === "approved" && <CheckCircle className="w-3 h-3" />}
                        {book.state === "pending" && <Clock className="w-3 h-3" />}
                        {book.state === "not_approved" && <XCircle className="w-3 h-3" />}
                        {book.state}
                      </span>
                      {book.isAdvertised && (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-secondary/10 text-secondary inline-flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Advertised
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-3">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{book.likesCount} likes</span>
                    </div>
                  </div>
                </div>

                {/* Genre and Release Date */}
                <div className="px-4 pb-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Genre: {book.genre}</span>
                    <span>Released: {new Date(book.releaseDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons - Fixed layout */}
                <div className="p-6 pt-0 mt-auto">
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleView(book)}
                      className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-background hover:bg-primary hover:text-white text-primary rounded-xl transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {}}
                      className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-background hover:bg-orange-500 hover:text-white text-primary rounded-xl transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-background hover:bg-red-500 hover:text-white text-primary rounded-xl transition-all"
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
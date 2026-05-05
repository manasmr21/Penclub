import { motion } from "motion/react";
import React, { useState, FormEvent } from "react";
import { Book, Pencil, Trash2, X, Plus, Heart, Eye, Bookmark } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/src/lib/store/store";
import { deleteBook, updateBook } from "@/src/lib/books-api";

const BookShelft = () => {
  const {
    user,
    books,
    loading,
    fetchBooks,
    fetchCounts,
  } = useAppStore();

  const loadingBooks = loading.books;
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [coverImageFiles, setCoverImageFiles] = useState<File[]>([]);

  const openEditModal = (book: any) => {
    setEditingBook(book);
    setTitle(book.title);
    setDescription(book.description);
    setGenre(book.genre);
  };

  const closeEditModal = () => {
    setEditingBook(null);
    setCoverImageFiles([]);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingBook || !user?.id) return;

    setIsSaving(true);
    try {
      await updateBook(editingBook.id, {
        title,
        description,
        genre,
        coverImageFiles: coverImageFiles.length > 0 ? coverImageFiles : undefined,
      });
      await fetchBooks(user.id, 1);
      closeEditModal();
    } catch {
      alert("Failed to update book");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBook = async (id: string, coverImages: string[]) => {
    if (!window.confirm("Are you sure you want to delete this publication?") || !user?.id) return;
    try {
      await deleteBook(id, coverImages);
      await Promise.all([fetchBooks(user.id, 1), fetchCounts(user.id)]);
    } catch {
      alert("Failed to delete publication");
    }
  };

  const getBookPrimaryImage = (book: any) => {
    if (book.coverImage) return book.coverImage;
    if (book.images && book.images.length > 0) {
      return book.images[0].url;
    }
    return null;
  };

  if (loadingBooks) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="aspect-[3/4.5] bg-primary/5 rounded-[1.5rem]" />
            <div className="space-y-2 px-2">
              <div className="h-5 w-3/4 bg-primary/5 rounded-lg" />
              <div className="h-3 w-1/2 bg-primary/5 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
          <Bookmark size={32} className="text-primary/20" />
        </div>
        <h3 className="text-lg font-bold text-primary font-serif mb-2">Your library is empty</h3>
        <p className="text-primary/40 text-xs max-w-xs mb-8">Start your journey by adding your first masterpiece.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {books.map((book) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex flex-col bg-white border border-primary/10 rounded-none transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Cover Section */}
            <div className="relative aspect-[4/2.5] overflow-hidden rounded-none bg-zinc-100">
              {getBookPrimaryImage(book) ? (
                <img 
                  src={getBookPrimaryImage(book)} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-primary/30 italic text-xs font-serif">
                  No Cover
                </div>
              )}

              {book.genre && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white text-[10px] font-sans font-semibold tracking-widest text-primary border border-primary/10">
                    {book.genre}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                 <button onClick={() => openEditModal(book)} className="h-8 w-8 flex items-center justify-center bg-white text-primary hover:bg-primary hover:text-white transition-all cursor-pointer border border-primary/10">
                    <Pencil size={14} />
                 </button>
                 <button onClick={() => handleDeleteBook(book.id, book.coverImages)} className="h-8 w-8 flex items-center justify-center bg-white text-red-600 hover:bg-red-500 hover:text-white transition-all cursor-pointer border border-primary/10">
                    <Trash2 size={14} />
                 </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col p-6">
              <Link href={`/bookshelf/${book.id}?from=profile`}>
                <h4 className="text-xl font-bold text-primary font-serif leading-tight mb-1 group-hover:text-primary/70 transition-colors line-clamp-1 cursor-pointer">
                  {book.title}
                </h4>
              </Link>
              
              <p className="text-sm italic text-primary/60 font-serif mb-3">
                {book.author?.name || user?.name || "Author"}
              </p>

              {book.description && (
                <p className="text-sm text-primary/80 font-sans line-clamp-2 leading-relaxed mb-4">
                  {book.description}
                </p>
              )}
              
              <div className="mt-auto pt-4 border-t border-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-primary/40">
                  {book.reviews && book.reviews.length > 0 && (
                    <div className="flex items-center gap-1">
                       <Heart size={12} className="fill-primary/20" />
                       <span className="text-[10px] font-sans uppercase tracking-wider">{book.reviews.length} reviews</span>
                    </div>
                  )}
                </div>
                <Link 
                  href={`/bookshelf/${book.id}?from=profile`}
                  className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary cursor-pointer hover:underline transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {editingBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/20 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-white overflow-hidden">
            <div className="px-10 py-8 border-b border-primary/5 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary font-serif">Edit Publication</h2>
              <button onClick={closeEditModal} className="p-2 rounded-full hover:bg-primary/5 text-primary/40 transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-10 space-y-8 max-h-[80vh] overflow-y-auto">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-14 bg-primary/[0.03] border border-primary/5 rounded-2xl px-6 text-sm font-bold text-primary outline-none focus:border-primary/20 transition-all" required />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full min-h-[140px] bg-primary/[0.03] border border-primary/5 rounded-[2rem] p-6 text-sm font-serif italic text-primary/70 outline-none focus:border-primary/20 transition-all resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Genre</label>
                  <input value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full h-14 bg-primary/[0.03] border border-primary/5 rounded-2xl px-6 text-sm font-bold text-primary outline-none focus:border-primary/20 transition-all" required />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">New Covers</label>
                  <input type="file" multiple onChange={(e) => setCoverImageFiles(Array.from(e.target.files ?? []))} className="w-full h-14 bg-primary/[0.03] border border-primary/5 rounded-2xl px-6 py-4 text-[10px] font-bold text-primary/30" />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={closeEditModal} className="h-14 flex-1 rounded-2xl border-2 border-primary/5 text-xs font-black uppercase tracking-widest text-primary/40 hover:bg-primary/5 transition-all cursor-pointer">Cancel</button>
                <button disabled={isSaving} className="h-14 flex-[2] rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookShelft;

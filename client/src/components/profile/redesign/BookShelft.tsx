import { motion } from "motion/react";
import { Book, Pencil, Trash2, X, Plus, Heart, Eye, Bookmark, Image as ImageIcon } from "lucide-react";
import React, { FormEvent, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this publication?") || !user?.id) return;
    try {
      await deleteBook(id);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white border border-primary/10 rounded-none flex flex-col h-full">
            {/* Cover Aspect Skeleton */}
            <div className="aspect-[4/2.5] bg-primary/5 rounded-none border-b border-primary/5" />
            {/* Content Area Skeleton */}
            <div className="p-6 flex-1 flex flex-col space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-3/4 bg-primary/10 rounded-none" />
                <div className="h-4 w-1/3 bg-primary/5 rounded-none" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-primary/5 rounded-none" />
                <div className="h-3 w-5/6 bg-primary/5 rounded-none" />
              </div>
              <div className="pt-4 border-t border-primary/5 mt-auto flex justify-between items-center">
                <div className="h-3 w-20 bg-primary/5 rounded-none" />
                <div className="h-3 w-16 bg-primary/10 rounded-none" />
              </div>
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
                <button onClick={() => handleDeleteBook(book.id)} className="h-8 w-8 flex items-center justify-center bg-white text-red-600 hover:bg-red-500 hover:text-white transition-all cursor-pointer border border-primary/10">
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

      {editingBook && typeof window !== "undefined" && createPortal(
                <div className="fixed inset-0 z-[9999] flex flex-col items-center py-20 px-4 bg-slate-900/40 backdrop-blur-md transition-all animate-in fade-in duration-300">
                  <div className="relative w-full max-w-xl max-h-[calc(100vh-10rem)] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 animate-in slide-in-from-top-8 duration-300 scrollbar-hide">
                    <button
                      onClick={closeEditModal}
                      className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                    >
                      <X size={20} />
                    </button>

                    <div className="flex flex-col items-center mb-4 text-center">
                      <h2 className="text-xl font-bold text-[#1e2741]">Edit Book</h2>
                    </div>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label className="ml-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Cover Images</label>
                        <div className="relative group aspect-[2/3] w-[180px] mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                          <img
                            src={coverImageFiles.length > 0 ? URL.createObjectURL(coverImageFiles[0]) : (getBookPrimaryImage(editingBook) || "/placeholder-book.png")}
                            alt="Preview"
                            className="h-full w-full object-cover transition-opacity group-hover:opacity-40"
                          />
                          <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 transition group-hover:opacity-100">
                            <div className="flex flex-col items-center gap-2 text-slate-900 text-center px-4">
                              <ImageIcon size={24} />
                              <span className="text-sm font-semibold">Select Images</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => setCoverImageFiles(Array.from(e.target.files ?? []))}
                            />
                          </label>
                        </div>
                        {!!coverImageFiles.length && (
                          <p className="text-[10px] text-center text-slate-500 mt-1">{coverImageFiles.length} new image(s) selected</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="ml-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Title</label>
                          <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:ring-2 focus:ring-primary focus:bg-white"
                            placeholder="Book title"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="ml-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Description</label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[140px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:ring-2 focus:ring-primary focus:bg-white resize-none"
                            placeholder="Book description..."
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="ml-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Genre</label>
                          <input
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:ring-2 focus:ring-primary focus:bg-white"
                            placeholder="Fiction, Mystery, etc."
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={closeEditModal}
                          className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-7 py-2 rounded-xl text-sm bg-primary font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all"
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>,
                document.body
              )}
            </div>
            );
};

            export default BookShelft;

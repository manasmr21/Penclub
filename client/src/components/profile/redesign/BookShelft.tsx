import React, { FormEvent, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Trash2, X, Image as ImageIcon } from 'lucide-react';
import Link from "next/link";
import type { AuthorBook } from "@/src/lib/profile-stats-api";
import { deleteBook, fetchReviewsByBook, updateBook } from "@/src/lib/books-api";
import Loader from "@/components/Loader";
import { Skeleton } from "@/src/components/ui/skeleton";

const BookCardSkeleton = () => (
  <div className="relative flex flex-col w-full max-w-[15rem] mx-auto animate-pulse">
    <Skeleton className="w-full aspect-[2/3] mb-6 rounded-none bg-slate-200/50" />
    <div className="flex flex-col px-1 gap-2">
      <Skeleton className="h-5 w-3/4 rounded-sm" />
      <Skeleton className="h-4 w-1/2 rounded-sm" />
      <Skeleton className="h-3 w-1/3 mt-1 rounded-sm" />
    </div>
  </div>
);

import { useAppStore } from '@/src/lib/store/store';

const BookShelft = () => {
  const { 
    user,
    books, 
    loading, 
    hasMoreBooks, 
    booksPage,
    fetchBooks,
    fetchCounts
  } = useAppStore();

  const loadingBooks = loading.books;
  const loadingMore = loading.moreBooks;

  const [editingBook, setEditingBook] = useState<AuthorBook | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [coverImageFiles, setCoverImageFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [ratingsByBook, setRatingsByBook] = useState<Record<string, { average: number; count: number }>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  const renderStars = (rating: number) => {
    const safe = Math.max(0, Math.min(5, Math.round(rating)));
    return "★".repeat(safe) + "☆".repeat(5 - safe);
  };

  React.useEffect(() => {
    let isMounted = true;

    const loadRatings = async () => {
      if (!books.length) {
        if (isMounted) setRatingsByBook({});
        return;
      }

      const nextEntries = await Promise.all(
        books.map(async (book) => {
          try {
            const reviews = await fetchReviewsByBook(book.id);
            const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            const average = reviews.length ? total / reviews.length : 0;
            return [book.id, { average, count: reviews.length }] as const;
          } catch {
            return [book.id, { average: 0, count: 0 }] as const;
          }
        }),
      );

      if (isMounted) {
        setRatingsByBook((prev) => ({
          ...prev,
          ...Object.fromEntries(nextEntries),
        }));
      }
    };

    void loadRatings();

    return () => {
      isMounted = false;
    };
  }, [books]);

  const getBookPrimaryImage = (book: AuthorBook) => {
    if (book.coverImage) return book.coverImage;
    return book.images?.[0]?.url;
  };

  function openEditModal(book: AuthorBook) {
    setEditingBook(book);
    setTitle(book.title || "");
    setDescription(book.description || "");
    setGenre(book.genre || "");
    setCoverImageFiles([]);
  }

  function closeEditModal() {
    setEditingBook(null);
    setTitle("");
    setDescription("");
    setGenre("");
    setCoverImageFiles([]);
  }

  async function handleEditSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingBook?.id || !user?.id) return;

    setIsSaving(true);
    try {
      await updateBook(editingBook.id, {
        title,
        description,
        genre,
        coverImageFiles,
      });
      closeEditModal();
      await fetchBooks(user.id, 1);
    } catch (error) {
      const maybeError = error as { response?: { data?: { message?: string } } };
      alert(maybeError.response?.data?.message ?? "Failed to update book.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(bookId: string) {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (!confirmed || !user?.id) return;

    try {
      await deleteBook(bookId);
      await Promise.all([
        fetchBooks(user.id, 1),
        fetchCounts(user.id)
      ]);
    } catch (error) {
      const maybeError = error as { response?: { data?: { message?: string } } };
      alert(maybeError.response?.data?.message ?? "Failed to delete book.");
    }
  }

  const setSentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node || !hasMoreBooks || loadingMore || !user?.id) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        void fetchBooks(user.id, booksPage + 1);
      },
      { threshold: 0.2 },
    );

    observerRef.current.observe(node);
  }, [hasMoreBooks, loadingMore, user?.id, booksPage, fetchBooks]);

  if (loadingBooks) {
    return (
      <div className="w-full pb-16">
        <div className="max-w-4xl mx-auto px-3 sm:px-0">
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-x-5 sm:gap-x-8 gap-y-10 sm:gap-y-12">
            {[...Array(6)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="w-full pb-16">
        <div className="max-w-4xl mx-auto text-center py-20 text-on-surface-variant/70">
          No books found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-16">
      <div className="max-w-4xl mx-auto px-3 sm:px-0">
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-x-5 sm:gap-x-8 gap-y-10 sm:gap-y-12">
          {books.map((book) => (
            <div key={book.id} className="relative flex flex-col group w-full max-w-[15rem] mx-auto">
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(book)}
                  className="h-7 w-7 grid place-items-center rounded-full bg-white text-[#1e2741] shadow-sm hover:bg-slate-100"
                  aria-label={`Edit ${book.title}`}
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(book.id)}
                  className="h-7 w-7 grid place-items-center rounded-full bg-white text-red-600 shadow-sm hover:bg-red-50"
                  aria-label={`Delete ${book.title}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <Link href={`/bookshelf/${book.id}?from=profile`} className="block">
                <div className="w-full aspect-[2/3] mb-6 bg-gray-200">
                  {getBookPrimaryImage(book) ? (
                    <img src={getBookPrimaryImage(book)} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-on-surface-variant/70 text-sm px-4 text-center">
                      No cover image
                    </div>
                  )}
                </div>

                <div className="flex flex-col px-1">
                  <h3 className="text-[17px] font-bold text-[#1e2741] tracking-normal leading-snug">{book.title}</h3>
                  <p className="text-[#697282] italic text-[15px] mt-[2px] font-serif capitalize">{book.genre}</p>
                  <p className="mt-2.5 text-[13px] text-[#f5b301]">
                    {renderStars(ratingsByBook[book.id]?.average ?? 0)}
                    {" "}
                    <span className="text-[#697282]">
                      ({ratingsByBook[book.id]?.count ?? 0})
                    </span>
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8">
          {loadingMore && (
            <p className="text-center text-sm text-on-surface-variant/70">Loading more books...</p>
          )}
          {!hasMoreBooks && books.length > 0 && (
            <p className="text-center text-sm text-on-surface-variant/70">You have reached the end.</p>
          )}
          <div ref={setSentinelRef} className="h-4 w-full" />
        </div>
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

"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Search, Book as BookIcon, Star, ArrowRight } from "lucide-react";
import { fetchAllBooks, fetchReviewsByBook } from "@/src/lib/books-api";
import type { AuthorBook } from "@/src/lib/profile-stats-api";
import Loader from "@/components/Loader";
import { SkeletonGrid } from "@/src/components/Skeleton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type BookWithRating = AuthorBook & {
  averageRating: number;
  reviewsCount: number;
};

function renderStars(rating: number) {
  const safe = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={`${i < safe ? "fill-primary text-primary" : "fill-primary/5 text-primary/10"}`}
        />
      ))}
    </div>
  );
}

function getBookPrimaryImage(book: AuthorBook) {
  if (book.coverImage) return book.coverImage;
  return book.images?.[0]?.url;
}

export default function BookshelfPage() {
  const [books, setBooks] = useState<BookWithRating[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(false);
  const pageSize = 10;

  const genres = useMemo(() => {
    const unique = new Set(books.map(b => b.genre).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [books]);

  const loadBooksPage = useCallback(async (targetPage: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (targetPage === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetchAllBooks(targetPage, pageSize);
      const booksWithRatings = await Promise.all(
        response.books.map(async (book) => {
          const reviews = await fetchReviewsByBook(book.id);
          const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
          const averageRating = reviews.length ? total / reviews.length : 0;

          return {
            ...book,
            averageRating,
            reviewsCount: reviews.length,
          };
        }),
      );

      setBooks((prev) => {
        if (targetPage === 1) return booksWithRatings;

        const existing = new Set(prev.map((item) => item.id));
        const incoming = booksWithRatings.filter((item) => !existing.has(item.id));
        return [...prev, ...incoming];
      });
      setHasNextPage(response.pagination?.hasNextPage ?? false);
      setPage(targetPage);
    } catch {
      if (targetPage === 1) {
        setBooks([]);
      }
      setHasNextPage(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadBooksPage(1);
  }, [loadBooksPage]);

  const setSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (!first?.isIntersecting) return;
          if (loading || loadingMore || !hasNextPage) return;
          void loadBooksPage(page + 1);
        },
        { threshold: 0.2 },
      );

      observerRef.current.observe(node);
    },
    [hasNextPage, loadBooksPage, loading, loadingMore, page],
  );

  const filteredBooks = useMemo(() => {
    let result = books;

    const query = appliedSearch.trim().toLowerCase();
    if (query) {
      result = result.filter((book) => {
        const title = (book.title || "").toLowerCase();
        const genre = (book.genre || "").toLowerCase();
        return title.includes(query) || genre.includes(query);
      });
    }

    if (activeGenre !== "All") {
      result = result.filter(book => book.genre === activeGenre);
    }

    return result;
  }, [books, appliedSearch, activeGenre]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <section className="pt-16 md:pt-28 md:pb-8">
          <div className="main-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div className="text-center md:text-left animate-pulse">
                <div className="h-2 w-20 bg-primary/5 mb-2" />
                <div className="h-8 w-48 bg-primary/10" />
              </div>
              <div className="w-full max-w-md h-11 bg-primary/5" />
            </div>
          </div>
        </section>
        <div className="main-container py-12">
          <SkeletonGrid count={6} />
        </div>
      </div>
    );
  }

  if (!books.length && !loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <div className="w-24 h-24 rounded-none flex items-center justify-center mx-auto border border-primary/5">
            <BookIcon size={40} className="text-primary/10" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-serif font-black text-primary tracking-tight">The library is quiet</h2>
            <p className="text-primary/40 font-serif italic text-lg">Check back soon for new literary additions to our collection.</p>
          </div>
          <Link href="/" className="inline-block px-10 py-4 bg-primary text-white font-sans font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Hero Section */}
      <section className="pt-16 md:pt-28 md:pb-8">
        <div className="main-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-2"
              >
                <span className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-primary/30">
                  The Collection
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-serif font-black text-primary tracking-tighter"
              >
                The Bookshelf
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-md"
            >
              <form
                className="relative group"
                onSubmit={(e) => {
                  e.preventDefault();
                  setAppliedSearch(searchInput.trim());
                }}
              >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search title, genre or author..."
                  className="w-full h-11 pl-12 pr-32 rounded-none border-b border-primary/10 bg-transparent text-sm font-serif text-primary outline-none focus:border-primary transition-all placeholder:text-primary/20"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-none font-sans font-black text-[9px] uppercase tracking-widest hover:bg-primary/90 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Search
                </button>
              </form>
            </motion.div>
          </div>

          {/* Integrated Genre Filter - Compact row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-2"
          >
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre!)}
                className={`px-4 py-1.5 rounded-none text-[10px] font-sans font-black uppercase tracking-[0.15em] transition-all cursor-pointer border ${activeGenre === genre
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-primary/30 border-primary/5 hover:border-primary/20 hover:text-primary/50"
                  }`}
              >
                {genre}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="main-container py-12">

        {!filteredBooks.length && appliedSearch && (
          <div className="py-20 text-center space-y-6">
            <p className="text-3xl font-serif text-primary font-black">No results for "{appliedSearch}"</p>
            <p className="text-primary/40 font-serif italic">Try adjusting your search or category filter.</p>
            <button
              onClick={() => {
                setSearchInput("");
                setAppliedSearch("");
                setActiveGenre("All");
              }}
              className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-primary hover:underline underline-offset-8 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16"
        >
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
              >
                <Link href={`/bookshelf/${book.id}?from=bookshelf`} className="group block h-full border border-primary/10 hover:border-primary/30 transition-all duration-500 cursor-pointer bg-white">
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-primary/[0.02] border-b border-primary/10">
                    {getBookPrimaryImage(book) ? (
                      <Image
                        src={getBookPrimaryImage(book)!}
                        alt={book.title}
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/10 italic font-serif text-sm px-6 text-center">
                        No cover art available
                      </div>
                    )}

                    {book.genre && (
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="px-2 py-1 bg-primary text-white text-[9px] font-sans font-black tracking-[0.2em] text-primary uppercase border border-primary/5">
                          {book.genre}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors duration-500" />
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col space-y-4">
                    <div>
                      <h3 className="text-xl font-serif font-black text-primary leading-tight mb-1 group-hover:italic transition-all">
                        {book.title}
                      </h3>
                      <p className="text-[11px] italic text-primary/40 font-serif tracking-wide">
                        by {book.author?.name || "Member Publication"}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        {book.reviewsCount > 0 ? (
                          <>
                            {renderStars(book.averageRating)}
                            <span className="text-[10px] font-sans font-black uppercase tracking-widest text-primary/20">
                              {book.reviewsCount} {book.reviewsCount === 1 ? 'Review' : 'Reviews'}
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary/20 italic">
                            First Edition
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all duration-300">
                        <span className="text-[11px] font-sans font-black uppercase tracking-[0.2em]">Open</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-primary/5">
          {loadingMore && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">Loading more works</p>
            </div>
          )}
          {!hasNextPage && books.length > 0 && (
            <p className="text-center text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/20 italic">The collection ends here</p>
          )}
          <div ref={setSentinelRef} className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}


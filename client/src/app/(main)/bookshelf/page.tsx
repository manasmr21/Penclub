"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { fetchAllBooks, fetchReviewsByBook } from "@/src/lib/books-api";
import type { AuthorBook } from "@/src/lib/profile-stats-api";
import FilterDropdown from "@/src/components/FilterDropdown";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { inkAndQuill, bookShelf, bookInkAndQuill, bookCase } from "@/public/images";
import AnimateIn from "@/src/components/ui/AnimateIn";
type BookWithRating = AuthorBook & {
  averageRating: number;
  reviewsCount: number;
};

// Golden/Tan Floral Icon Flanking the Ornate Title
const FlowerSVG = () => (
  <svg className="w-8 h-8 text-[#E8D5B7]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2L14.5,9H22L16,13.5L18.5,21L12,16.5L5.5,21L8,13.5L2,9H9.5L12,2Z" />
  </svg>
);

function renderStars(rating: number) {
  const safe = Math.max(0, Math.min(5, Math.round(rating || 4)));
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={`${i < safe ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
}

function getBookPrimaryImage(book: AuthorBook) {
  if (book.coverImage) return book.coverImage;
  return book.images?.[0]?.url;
}

// Pastel cover background containers exactly matching the HTML mockup
function getPastelBg(index: number) {
  const bgs = ["bg-blue-50", "bg-purple-50", "bg-cyan-50", "bg-yellow-50", "bg-red-50"];
  return bgs[index % bgs.length];
}

// Custom badges exactly matching the mockup specifications
function getBadgeColor(genre: string) {
  const g = (genre || "").toLowerCase();
  if (g.includes("fiction")) return "bg-[#E6693E]";
  if (g.includes("psychology")) return "bg-[#008080]";
  if (g.includes("poetry")) return "bg-purple-600";
  if (g.includes("fantasy")) return "bg-indigo-600";
  if (g.includes("biography") || g.includes("non-fiction")) return "bg-yellow-600";
  return "bg-[#1D4E89]";
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
  const shelfRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const pageSize = 10; // Formatted perfectly for a 5-column grid rows layout

  const genres = useMemo(() => {
    if (loading) {
      return ["All", "Fiction", "Non-Fiction", "Poetry", "Fantasy", "Biography", "History", "Psychology"];
    }
    const unique = new Set(books.map(b => b.genre).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [books, loading]);

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

  if (!books.length && !loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-[#FDF9F0]">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <div className="w-32 h-auto flex items-center justify-center mx-auto mb-4">
            <Image src={bookCase} alt="Bookcase" className="w-full h-auto mix-blend-multiply" />
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
    <div className="min-h-screen bg-[#FDF9F0] text-[#1A1A1A]">

      {/* BEGIN: HeroSection */}
      <section className="relative overflow-hidden bg-[#FDF9F0] pt-10 md:pt-20 pb-16 md:pb-28 px-4 md:px-8">

        {/* Abstract shapes matching the HTML mockup exactly */}
        <div className="absolute bottom-[-20%] md:bottom-[-10%] left-[-10%] w-[120%] h-[60%] bg-[#1D4E89] rounded-t-[50%] z-0 -rotate-2 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">

          {/* Local line art shelf illustration on the left */}
          <AnimateIn variant="fade-right" delay={0.2} className="absolute left-0 -bottom-15 w-64 pointer-events-none hidden lg:block">
            <Image src={bookShelf} alt="Line Art Shelf" className="mix-blend-multiply object-contain" />
          </AnimateIn>

          {/* Local line art ink & quill illustration on the top left */}
          <AnimateIn variant="fade-down" delay={0.1} className="absolute left-0 -top-20 w-44 pointer-events-none hidden lg:block">
            <Image src={inkAndQuill} alt="Line Art Ink & Quill" className="mix-blend-multiply object-contain" />
          </AnimateIn>

          {/* Local line art book & quill illustration on the right */}
          <AnimateIn variant="fade-left" delay={0.15} className="absolute right-0 top-10 w-52 pointer-events-none hidden lg:block">
            <Image src={bookInkAndQuill} alt="Line Art Book & Quill" className="mix-blend-multiply object-contain" />
          </AnimateIn>

          <AnimateIn variant="fade-up" delay={0} className="flex flex-col items-center">
            <h1 className="text-3xl md:text-6xl font-bold text-secondary max-w-3xl leading-tight font-sans">
              Discover stories <br /> that stay <span className="font-serif italic text-[#1D4E89] font-normal">with you</span>
            </h1>
            <p className="mt-6 text-lg text-black md:text-white font-bold font-sans">
              Books are the quiet ones that speak the loudest.
            </p>
            <button 
              onClick={() => shelfRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-8 mx-auto bg-[#E6693E] text-white px-8 py-3 rounded-full flex items-center justify-center gap-2 font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Explore Collection
            </button>
          </AnimateIn>
        </div>
      </section>
      {/* END: HeroSection */}

      {/* BEGIN: BookshelfControls */}
      <section ref={shelfRef} className="max-w-7xl mx-auto px-8 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: 0.55 }}
          className="bg-white rounded-3xl p-8 shadow-sm"
        >
          {/* Centered Bookshelf Title */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.68 }}
            className="flex flex-col items-center justify-center mb-8 pt-4 gap-2"
          >
            <div className="flex items-center gap-4">
              <FlowerSVG />
              <h2 className="text-3xl font-serif font-bold text-[#E6693E] italic tracking-tight">The Bookshelf</h2>
              <div className="scale-x-[-1] flex items-center">
                <FlowerSVG />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.78 }}
            className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6"
          >
            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full md:w-auto">
              <FilterDropdown
                options={genres}
                selected={activeGenre}
                onChange={setActiveGenre}
                loading={loading}
                label="Select Genre"
                placeholder="All Books"
              />
              {(activeGenre !== "All" || appliedSearch !== "" || searchInput !== "") && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => {
                    setActiveGenre("All");
                    setAppliedSearch("");
                    setSearchInput("");
                  }}
                  className="text-xs font-sans font-bold uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors cursor-pointer py-3 px-1 flex items-center gap-1.5 shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Filters
                </motion.button>
              )}
            </div>

            {/* Fully rounded search input */}
            <div className="flex items-center bg-gray-50 rounded-full pl-5 pr-1.5 py-1.5 w-full md:w-96 border border-gray-100 shadow-sm relative group">
              <form
                className="w-full flex items-center justify-between"
                onSubmit={(e) => {
                  e.preventDefault();
                  setAppliedSearch(searchInput.trim());
                }}
              >
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search title, genre or author..."
                  className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-gray-400 outline-none text-[#1A1A1A] mr-2 pl-1"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-[#1D4E89] hover:bg-[#1D4E89]/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* BEGIN: BookGrid */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.88 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-8 border-t border-gray-100 mt-4"
          >
            {loading ? (
              // Shimmer Skeleton Loader matching reference card designs exactly
              [...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="book-card p-4 rounded-3xl bg-white border border-gray-100 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="rounded-2xl mb-4 h-48 bg-gray-100 animate-pulse flex items-center justify-center relative overflow-hidden" />
                    <div>
                      <div className="h-4 w-14 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mt-3" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse mt-1.5" />
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between mt-2 mb-4">
                      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="w-full h-8 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredBooks.map((book, index) => {
                  // Generate dynamic page layouts
                  const pages = (book.title.length * 11) + 144;

                  return (
                    <motion.div
                      key={book.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6, delay: index * 0.04 }}
                      className="book-card p-4 rounded-2xl bg-white border border-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col justify-between"
                    >
                      <Link href={`/bookshelf/${book.id}?from=bookshelf`} className="group flex flex-col h-full justify-between animate-fadeIn">
                        <div>
                          {/* Pastel background cover containers */}
                          <div className={`rounded-xl p-4 mb-4 flex justify-center h-48 relative transition-all duration-500 ${getPastelBg(index)}`}>
                            {getBookPrimaryImage(book) ? (
                              <Image
                                src={getBookPrimaryImage(book)!}
                                alt={book.title}
                                width={110}
                                height={160}
                                className="h-full object-contain rounded shadow-lg transform hover:scale-105 transition-transform duration-500"
                                sizes="120px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#1D4E89]/10 italic font-serif text-xs px-4 text-center">
                                No cover art
                              </div>
                            )}
                          </div>

                          {/* Details Area */}
                          <div>
                            {book.genre && (
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${getBadgeColor(book.genre)}`}>
                                {book.genre}
                              </span>
                            )}

                            <h3 className="mt-2 font-bold text-sm text-gray-900 truncate group-hover:text-[#1D4E89] transition-colors">
                              {book.title}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">
                              By {book.author?.name || "Member Publication"}
                            </p>

                            <div className="mt-1 mb-2">
                              {renderStars(book.averageRating)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto pt-2">
                          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-4 font-medium">
                            <span className="flex items-center gap-1">{pages} pages</span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                              Read time
                            </span>
                          </div>

                          <button className="w-full border border-gray-300 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                            Open Book
                          </button>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Infinite Scroll Sentinel */}
          <div className="mt-8 pt-8">
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
        </motion.div>
      </section>
      {/* END: BookGrid */}

    </div>
  );
}

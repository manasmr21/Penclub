"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { fetchAllBooks, fetchReviewsByBook } from "@/src/lib/books-api";
import type { AuthorBook } from "@/src/lib/profile-stats-api";
import Loader from "@/components/Loader";

type BookWithRating = AuthorBook & {
  averageRating: number;
  reviewsCount: number;
};

function renderStars(rating: number) {
  const safe = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(safe) + "☆".repeat(5 - safe);
}

function getBookPrimaryImage(book: AuthorBook) {
  if (book.coverImage) return book.coverImage;
  return book.images?.[0]?.url;
}

export default function BookshelfPage() {
  const [books, setBooks] = useState<BookWithRating[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(false);
  const pageSize = 10;

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
    const query = appliedSearch.trim().toLowerCase();
    if (!query) return books;

    return books.filter((book) => {
      const title = (book.title || "").toLowerCase();
      const genre = (book.genre || "").toLowerCase();
      return title.includes(query) || genre.includes(query);
    });
  }, [books, appliedSearch]);

  if (loading) {
   return <Loader fullScreen />;
  }

  if (!books.length) {
    return (
      <div className="main-container pt-24 pb-10">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center text-on-surface-variant/70">No books found</div>
      </div>
    );
  }

  return (
    <div className="main-container pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 max-w-xl mx-auto">
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setAppliedSearch(searchInput.trim());
            }}
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search books by title or genre..."
              className="h-11 w-full rounded-xl border border-[#dbe3ef] bg-gray-100 px-4 text-sm text-[#1e2741] outline-none focus:ring-2 focus:ring-[#1e2741]/20"
            />
            <button
              type="submit"
              className="h-11 rounded-xl bg-[#1e2741] px-5 text-sm font-semibold text-white hover:opacity-90"
            >
              Search
            </button>
          </form>
        </div>

        {!filteredBooks.length && (
          <div className="py-12 text-center text-on-surface-variant/70">
            No books match your search.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filteredBooks.map((book) => (
            <Link key={book.id} href={`/bookshelf/${book.id}?from=bookshelf`} className="block">
              <article className="flex flex-col w-full transition-transform duration-200 hover:-translate-y-1">
                <div className="w-full aspect-[2/3] mb-5 bg-gray-200 rounded-md overflow-hidden">
                  {getBookPrimaryImage(book) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getBookPrimaryImage(book)} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-on-surface-variant/70 text-sm px-4 text-center">
                      No cover image
                    </div>
                  )}
                </div>
                <h3 className="text-[17px] font-bold text-[#1e2741] leading-snug">{book.title}</h3>
                <p className="text-[#697282] italic text-[14px] mt-1 font-serif capitalize">{book.genre}</p>
                <p className="mt-2 text-[13px] text-[#3b4a64]">
                  {book.reviewsCount ? renderStars(book.averageRating) : "No ratings yet"}
                  {book.reviewsCount ? ` (${book.reviewsCount})` : ""}
                </p>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          {loadingMore && (
            <p className="text-center text-sm text-on-surface-variant/70">Loading more books...</p>
          )}
          {!hasNextPage && books.length > 0 && (
            <p className="text-center text-sm text-on-surface-variant/70">You have reached the end.</p>
          )}
          <div ref={setSentinelRef} className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}


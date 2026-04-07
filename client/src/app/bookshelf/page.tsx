"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAllBooks, fetchReviewsByBook } from "@/src/lib/books-api";
import type { AuthorBook } from "@/src/lib/profile-stats-api";

type BookWithRating = AuthorBook & {
  averageRating: number;
  reviewsCount: number;
};

function renderStars(rating: number) {
  const safe = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(safe) + "☆".repeat(5 - safe);
}

export default function BookshelfPage() {
  const [books, setBooks] = useState<BookWithRating[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const booksPerTab = 12;

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const nextBooks = await fetchAllBooks();
        const booksWithRatings = await Promise.all(
          nextBooks.map(async (book) => {
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

        setBooks(booksWithRatings);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    void loadBooks();
  }, []);

  const totalTabs = Math.max(1, Math.ceil(books.length / booksPerTab));
  const startIndex = (activeTab - 1) * booksPerTab;
  const visibleBooks = books.slice(startIndex, startIndex + booksPerTab);

  useEffect(() => {
    if (activeTab > totalTabs) {
      setActiveTab(totalTabs);
    }
  }, [activeTab, totalTabs]);

  if (loading) {
    return (
      <div className="main-container pt-24 pb-10">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center text-on-surface-variant/70">Loading books...</div>
      </div>
    );
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
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {visibleBooks.map((book) => (
            <Link key={book.id} href={`/bookshelf/${book.id}`} className="block">
              <article className="flex flex-col w-full transition-transform duration-200 hover:-translate-y-1">
                <div className="w-full aspect-[2/3] mb-5 bg-gray-200 rounded-md overflow-hidden">
                  {book.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
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

        {totalTabs > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab((prev) => Math.max(1, prev - 1))}
              disabled={activeTab === 1}
              className="h-9 rounded-md border border-[#dbe3ef] bg-white px-3 text-sm font-medium text-[#1e2741] transition hover:bg-[#f5f7fb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from(new Set([activeTab - 1, activeTab, activeTab + 1]))
              .filter((tab) => tab >= 1 && tab <= totalTabs)
              .map((tab) => {
                const isActive = tab === activeTab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`h-9 min-w-9 rounded-md px-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#1e2741] text-white"
                        : "border border-[#dbe3ef] bg-white text-[#1e2741] hover:bg-[#f5f7fb]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}

            <button
              type="button"
              onClick={() => setActiveTab((prev) => Math.min(totalTabs, prev + 1))}
              disabled={activeTab === totalTabs}
              className="h-9 rounded-md border border-[#dbe3ef] bg-white px-3 text-sm font-medium text-[#1e2741] transition hover:bg-[#f5f7fb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

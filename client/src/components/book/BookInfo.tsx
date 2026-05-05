"use client";

import type { AuthorBook } from "@/src/lib/profile-stats-api";
import { formatPublishedDate } from "./utils/book-utils";

interface BookInfoProps {
  book: AuthorBook;
  authorName: string;
  canFollowAuthor: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  onFollowAuthor: () => void;
}


export function BookInfo({
  book,
  authorName,
  canFollowAuthor,
  isFollowing,
  followLoading,
  onFollowAuthor,
}: BookInfoProps) {
  return (
    <div className="lg:col-span-6">
      {/* Genre / Featured badges */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          {book.genre || "General"}
        </span>
        <span className="rounded-full bg-secondary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
          Featured
        </span>
      </div>


      <h1 className="font-quicksand text-3xl font-bold tracking-tight text-primary md:text-4xl">
        {book.title}
      </h1>

      {/* Author + follow */}
      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <p className="italic">
          by <span className="not-italic font-semibold text-foreground">{authorName}</span>
        </p>
        {canFollowAuthor && (
          <button
            type="button"
            onClick={onFollowAuthor}
            disabled={followLoading}
            className="text-xs font-semibold lowercase tracking-[0.12em] text-primary transition hover:bg-primary/10 disabled:opacity-60"
          >
            {followLoading ? "Please wait..." : isFollowing ? "Following" : "Follow author"}
          </button>
        )}
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          First Published
        </p>
        <p className="mt-1 text-base font-semibold text-foreground">
          {formatPublishedDate(book.createdAt)}
        </p>
      </div>

      <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground">
        {book.description?.trim() || "No description provided for this book yet."}
      </p>


      <div className="mt-8 flex flex-wrap gap-3">
        <button className="rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition hover:opacity-90">
          Read now
        </button>
        <button className="rounded-full border border-border bg-card px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary transition hover:bg-muted/60">
          Add to Readlist
        </button>
      </div>
    </div>
  );
}

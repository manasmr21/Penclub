"use client";

import { type FormEvent } from "react";
import type { BookReview } from "@/src/lib/books-api";
import { renderStars, formatRelativeTime, getInitials } from "./utils/book-utils";

interface BookReviewsProps {
  reviews: BookReview[];
  myReview: BookReview | null;
  rating: number;
  content: string;
  submitting: boolean;
  canReview: boolean;
  onRatingChange: (value: number) => void;
  onContentChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function BookReviews({
  reviews,
  myReview,
  rating,
  content,
  submitting,
  canReview,
  onRatingChange,
  onContentChange,
  onSubmit,
}: BookReviewsProps) {
  return (
    <section className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
      {/* Review List */}
      <div className="lg:col-span-9">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-primary/10 pb-6">
          <div>
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">Discussion</p>
            <h2 className="text-3xl font-serif font-bold text-[#0A192F] md:text-4xl">
              Comments &amp; Reviews
            </h2>
          </div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">
            {reviews.length} Discussion{reviews.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => <ReviewCard key={review.id} review={review} />)
          ) : (
            <div className="border border-primary/10 bg-zinc-50 p-8 text-center">
              <p className="text-sm font-sans italic text-primary/40">
                No comments or reviews yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Form */}
      <aside className="space-y-6 lg:col-span-3">
        <div className="border border-primary/10 bg-white p-6">
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">
            Your Voice
          </p>
          <h3 className="text-xl font-serif font-bold text-[#0A192F]">
            {myReview ? "Edit Your Thoughts" : "Share Your Thoughts"}
          </h3>
          <p className="mt-2 text-sm font-sans italic text-primary/50 leading-relaxed">
            Your perspective helps readers discover what to pick up next.
          </p>

          {canReview ? (
            <form className="mt-6 space-y-5" onSubmit={onSubmit}>
              {/* Star Rating */}
              <div className="space-y-2">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">
                  Rating
                </label>
                <div className="border border-primary/10 bg-zinc-50 p-3 flex items-center justify-center gap-1 text-2xl leading-none text-[#d4a017]">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onRatingChange(value)}
                      aria-label={`Set rating to ${value} star${value > 1 ? "s" : ""}`}
                      className="transition-transform hover:scale-110 cursor-pointer"
                    >
                      {value <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label
                  htmlFor="review-content"
                  className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40"
                >
                  Comment
                </label>
                <textarea
                  id="review-content"
                  value={content}
                  onChange={(e) => onContentChange(e.target.value)}
                  rows={5}
                  placeholder="Write your review..."
                  className="w-full resize-none rounded-none border border-primary/20 bg-zinc-50 p-4 text-sm font-serif italic text-[#0A192F]/80 outline-none transition-all focus:border-primary focus:bg-white placeholder:text-primary/20"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-none bg-[#0A192F] text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting
                  ? "Saving..."
                  : myReview
                  ? "Update Review"
                  : "Add Review"}
              </button>
            </form>
          ) : (
            <p className="mt-5 text-sm font-sans italic text-primary/40 border border-primary/10 bg-zinc-50 p-4">
              Only verified users can add a rating and comment.
            </p>
          )}
        </div>
      </aside>
    </section>
  );
}

function ReviewCard({ review }: { review: BookReview }) {
  const reviewerName = review.user?.name || review.user?.username || "Reader";

  return (
    <article className="border border-primary/10 bg-white p-6 transition-all hover:shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-10 w-10 shrink-0 flex items-center justify-center border border-primary/10 bg-zinc-50 text-sm font-serif font-bold text-[#0A192F]">
            {getInitials(reviewerName)}
          </div>
          <div>
            <p className="font-sans font-bold text-[#0A192F] text-sm">{reviewerName}</p>
            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary/40">
              Verified Reader &bull; {formatRelativeTime(review.createdAt)}
            </p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 text-lg leading-none text-[#d4a017]">
          {renderStars(review.rating).map((filled, index) => (
            <span key={`${review.id}-star-${index}`} aria-hidden="true">
              {filled ? "★" : "☆"}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm font-serif italic text-primary/70 leading-relaxed">
        {review.content?.trim() || "No written comment shared for this rating."}
      </p>
    </article>
  );
}

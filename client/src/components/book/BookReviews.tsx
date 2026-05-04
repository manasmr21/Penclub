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
      {/* Review List Section */}
      <div className="lg:col-span-9">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-quicksand text-3xl font-bold text-primary md:text-4xl">
            Comments &amp; Reviews
          </h2>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {reviews.length} Discussion{reviews.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="space-y-5">
          {reviews.length > 0 ? (
            reviews.map((review) => <ReviewCard key={review.id} review={review} />)
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
              No comments or reviews yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>

      {/* Review Form Section */}
      <aside className="space-y-8 lg:col-span-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-xl font-bold text-primary">
            {myReview ? "Edit Your Thoughts" : "Share Your Thoughts"}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your perspective helps readers discover what to pick up next.
          </p>

          {canReview ? (
            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
              <div className="rounded-lg border border-border bg-background p-2.5">
                <div className="flex items-center justify-center gap-1 text-2xl leading-none text-[#d4a017]">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onRatingChange(value)}
                      aria-label={`Set rating to ${value} star${value > 1 ? "s" : ""}`}
                      className="transition hover:scale-110"
                    >
                      {value <= rating ? "\u2605" : "\u2606"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-content"
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  Comment
                </label>
                <textarea
                  id="review-content"
                  value={content}
                  onChange={(e) => onContentChange(e.target.value)}
                  rows={4}
                  placeholder="Write your review..."
                  className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : myReview
                  ? "Update Rating & Comment"
                  : "Add Your Rating & Comment"}
              </button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Only verified users can add rating and comment.</p>
          )}
        </div>
      </aside>
    </section>
  );
}

function ReviewCard({ review }: { review: BookReview }) {
  const reviewerName = review.user?.name || review.user?.username || "Reader";

  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/20 text-sm font-bold text-primary">
            {getInitials(reviewerName)}
          </div>
          <div>
            <p className="font-semibold text-foreground">{reviewerName}</p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Verified Reader &bull; {formatRelativeTime(review.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-lg leading-none text-[#d4a017]">
          {renderStars(review.rating).map((filled, index) => (
            <span key={`${review.id}-star-${index}`} aria-hidden="true">
              {filled ? "\u2605" : "\u2606"}
            </span>
          ))}
        </div>
      </div>

      <p className="leading-relaxed text-muted-foreground">
        {review.content?.trim() || "No written comment shared for this rating."}
      </p>
    </article>
  );
}

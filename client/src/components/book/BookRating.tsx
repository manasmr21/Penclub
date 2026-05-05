"use client";

import { renderStars, getRatingDistribution } from "./utils/book-utils";
import type { BookReview } from "@/src/lib/books-api";

interface BookRatingProps {
  reviews: BookReview[];
  averageRating: number;
  roundedAverageRating: number;
}

export function BookRating({ reviews, averageRating, roundedAverageRating }: BookRatingProps) {
  const distribution = getRatingDistribution(reviews);

  return (
    <div className="lg:col-span-3">
      <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-xl">
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] opacity-80">
          Reader Consensus
        </h3>

        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-5xl font-bold md:text-6xl">{roundedAverageRating.toFixed(1)}</span>
          <span className="text-lg opacity-70">/ 5.0</span>
        </div>

        <div className="mb-5 flex items-center gap-1 text-2xl leading-none text-[#f5c542]">
          {renderStars(averageRating).map((filled, index) => (
            <span key={`avg-star-${index}`} aria-hidden="true">
              {filled ? "\u2605" : "\u2606"}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          {distribution.map(({ star, width }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="w-3 text-xs font-semibold">{star}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-foreground/20">
                <div className="h-full rounded-full bg-secondary" style={{ width }} />
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute -right-10 -top-8 h-28 w-28 rounded-full bg-primary-foreground/10 blur-2xl" />
      </div>
    </div>
  );
}

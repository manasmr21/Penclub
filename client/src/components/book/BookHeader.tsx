"use client";

import { useState } from "react";
import type { AuthorBook } from "@/src/lib/profile-stats-api";
import { formatPublishedDate } from "./utils/book-utils";
import FlipBook from "@/components/FlipBook/FlipBook";

interface BookHeaderProps {
  book: AuthorBook;
  authorName: string;
  canFollowAuthor: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  onFollowAuthor: () => void;
  imageUrls: string[];
  selectedImage: string | null;
  onSelectImage: (url: string) => void;
}

export function BookHeader({
  book,
  authorName,
  canFollowAuthor,
  isFollowing,
  followLoading,
  onFollowAuthor,
  imageUrls,
  selectedImage,
  onSelectImage,
}: BookHeaderProps) {

  const [openReader, setOpenReader] = useState(false);

  return (
    <>
      {/* Book Image Gallery Section */}
      <div className="relative lg:col-span-3">
        <div className="mx-auto aspect-[3/4] max-w-[260px] overflow-hidden rounded-xl border border-border bg-muted shadow-xl">
          {selectedImage ? (
            <img src={selectedImage} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center px-4 text-center text-sm text-muted-foreground">
              No cover image available
            </div>
          )}
        </div>

        {imageUrls.length > 1 && (
          <div className="mx-auto mt-3 flex max-w-[260px] items-center gap-2 overflow-x-auto pb-1">
            {imageUrls.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => onSelectImage(url)}
                className={`h-14 w-12 shrink-0 overflow-hidden rounded-md border bg-muted transition ${
                  url === selectedImage ? "border-primary ring-1 ring-primary/40" : "border-border"
                }`}
              >
                <img src={url} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Book Info Section */}
      <div className="lg:col-span-6">
        <h1 className="text-3xl font-bold">{book.title}</h1>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground">First Published</p>
          <p className="font-semibold">{formatPublishedDate(book.createdAt)}</p>
        </div>

        <p className="mt-6 text-muted-foreground">
          {book.description || "No description available"}
        </p>

        
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => setOpenReader(true)}
            disabled={!imageUrls.length}
            className="rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90 disabled:opacity-50"
          >
            Read Now
          </button>

          <button className="rounded-full border px-6 py-3 text-xs font-bold">
            Add to Readlist
          </button>
        </div>
      </div>

      
      {openReader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          
          {/* Close Button */}
          <button
            onClick={() => setOpenReader(false)}
            aria-label="Close book reader"
            className="absolute right-4 top-4 z-[60] grid h-10 w-10 place-items-center rounded-full bg-white/15 text-2xl leading-none text-white backdrop-blur transition hover:bg-white/25"
          >
            &times;
          </button>

          {/* FlipBook */}
          <div className="w-full max-w-4xl">
            <FlipBook pages={imageUrls} />
          </div>

        </div>
      )}
    </>
  );
}



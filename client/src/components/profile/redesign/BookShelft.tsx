import React from 'react';
import { Star } from 'lucide-react';
import type { AuthorBook } from "@/src/lib/profile-stats-api";

type BookShelftProps = {
  books: AuthorBook[];
  loading?: boolean;
};

const BookShelft = ({ books, loading = false }: BookShelftProps) => {
  if (loading) {
    return (
      <div className="w-full pb-16">
        <div className="max-w-4xl mx-auto text-center py-20 text-on-surface-variant/70">
          Loading books...
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
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-12">
          {books.map((book) => (
            <div key={book.id} className="flex flex-col group cursor-pointer w-full max-w-56 mx-auto">
              <div className="w-full aspect-[2/3] mb-6 bg-gray-200">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-on-surface-variant/70 text-sm px-4 text-center">
                    No cover image
                  </div>
                )}
              </div>

              <div className="flex flex-col px-1">
                <h3 className="text-[17px] font-bold text-[#1e2741] tracking-normal leading-snug">{book.title}</h3>
                <p className="text-[#697282] italic text-[15px] mt-[2px] font-serif capitalize">{book.genre}</p>
                <div className="flex gap-[3px] mt-2.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-[#ffaf8e] text-[#ffaf8e]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookShelft;

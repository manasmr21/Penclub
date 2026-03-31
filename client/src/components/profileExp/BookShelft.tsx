import React from 'react';
import { Star } from 'lucide-react';

const books = [
  {
    title: "The Haunting of Hill House",
    author: "Shirley Jackson",
    coverImage: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    coverImage: "https://images.unsplash.com/photo-1578308365112-c2cb1b3cc58d?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "The Secret History",
    author: "Donna Tartt",
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Never Let Me Go",
    author: "Kazuo Ishiguro",
    coverImage: "https://images.unsplash.com/photo-1476081718509-d5d0b661a376?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Circe",
    author: "Madeline Miller",
    coverImage: "https://images.unsplash.com/photo-1533038590840-1c79e7c3e5eb?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Wuthering Heights",
    author: "Emily Brontë",
    coverImage: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=600&auto=format&fit=crop",
  }
];

const BookShelft = () => {
  return (
    <div className="w-full pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-12">
          {books.map((book, idx) => (
            <div key={idx} className="flex flex-col group cursor-pointer w-full max-w-56 mx-auto">

              {/* Book Cover Container */}
              <div className="w-full aspect-[2/3] mb-6 bg-gray-200">
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              </div>

              {/* Book Details */}
              <div className="flex flex-col px-1">
                <h3 className="text-[17px] font-bold text-[#1e2741] tracking-normal leading-snug">{book.title}</h3>
                <p className="text-[#697282] italic text-[15px] mt-[2px] font-serif">{book.author}</p>
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

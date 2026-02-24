"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

const cards = [
  { id: 1, title: "Card 1" },
  { id: 2, title: "Card 2" },
  { id: 3, title: "Card 3" },
  { id: 4, title: "Card 4" },
  { id: 5, title: "Card 5" },
  { id: 6, title: "Card 6" },
  { id: 7, title: "Card 7" },
  { id: 8, title: "Card 8" },
  { id: 9, title: "Card 9" },
];

const HeroCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <div className="relative">

      {/* LEFT BUTTON */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-2 lg:-left-12 bottom-4 lg:bottom-8 z-20
                   bg-[#e8aa05] text-white w-9 h-9 lg:w-10 lg:h-10
                   rounded-full flex items-center justify-center
                   hover:scale-105 transition"
      >
        ‹
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-2 lg:-right-12 bottom-4 lg:bottom-8 z-20
                   bg-[#e8aa05] text-white w-9 h-9 lg:w-10 lg:h-10
                   rounded-full flex items-center justify-center
                   hover:scale-105 transition"
      >
        ›
      </button>

      {/* CAROUSEL */}
      <div className="overflow-hidden max-w-[850px] mx-auto" ref={emblaRef}>
        <div className="flex">

          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`flex-[0_0_85%] sm:flex-[0_0_60%] lg:flex-[0_0_33.3333%]
                          px-2 lg:px-3 transition-all duration-500 ${
                index === selectedIndex
                  ? "scale-100 origin-bottom z-10"
                  : "scale-90 lg:scale-85 origin-bottom opacity-70"
              }`}
            >
              <div className="bg-white rounded-2xl shadow-xl h-72 sm:h-80 lg:h-96
                              flex items-center justify-center text-xl font-semibold">
                {card.title}
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default HeroCarousel;
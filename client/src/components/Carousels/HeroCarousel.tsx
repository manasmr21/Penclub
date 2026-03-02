"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { book,book2,book3, book4, book5, book6 } from "@/public/images";
import Image from "next/image";

const cards = [
  { id: 1, title: "Card 1", book: book3 },
  { id: 2, title: "Card 2", book: book },
  { id: 3, title: "Card 3", book: book2 },
  { id: 4, title: "Card 4", book: book4 },
  { id: 5, title: "Card 5", book: book5 },
  { id: 6, title: "Card 6", book: book6 },
  { id: 7, title: "Card 7", book: book3 },
  { id: 8, title: "Card 8", book: book },
  { id: 9, title: "Card 9", book: book2 },
  { id: 10, title: "Card 10", book: book4 },
  { id: 11, title: "Card 11", book: book5 },
  { id: 12, title: "Card 12", book: book6 },
];

export default function HeroCarousel() {
  const [api, setApi] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 2500,
          }),
        ]}
        opts={{
          align: "start",
          containScroll: "trimSnaps",
        }}
        className="w-full  mx-auto"
      >
        <CarouselContent className="px-2">
          {cards.map((card, index) => (
            <CarouselItem
              key={card.id}
              className="basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div
                className={`
                  flex items-center justify-center
                  h-[220px] sm:h-[260px] md:h-[300px] lg:h-[350px] 
                  transition-all duration-500
                  origin-bottom
                  ${
                    index === selectedIndex
                      ? "lg:scale-100 lg:z-10"
                      : "lg:scale-90"
                  }
                `}
              >
                <div className="w-full h-full relative">
                  <Image
                    src={card.book}
                    alt={card.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* SAME BUTTON POSITIONS AS YOUR ORIGINAL */}
        <CarouselPrevious className="absolute right-full top-[77%] bg-[#e8aa05] text-white p-5" />
        <CarouselNext className="absolute left-full top-[77%] bg-[#e8aa05] text-white p-5" />
      </Carousel>
    </div>
  );
}
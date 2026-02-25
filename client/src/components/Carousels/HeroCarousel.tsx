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
import {book} from "@/public/images";
import Image from "next/image";

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
    <div className="relative">
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        opts={{
          align: "start",
          containScroll: "trimSnaps",
        }}
        className="max-w-[850px] mx-auto "
      >
        <CarouselContent className="">
          {cards.map((card, index) => (
            <CarouselItem
              key={card.id}
              className="basis-1/1 sm:basis-1/2 lg:basis-1/3 "
            >
              <div
                className={`
                             h-85
                            flex items-center justify-center
                            text-xl font-semibold
                            transition-all duration-500
                            origin-bottom 
                            ${
                              index === selectedIndex
                                ? "scale-100 z-10"
                                : "scale-90 lg:scale-85"
                            }`}
              >
                <Image src={book} alt={card.title} className="w-full h-full " />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute right-full top-[90%] bg-[#e8aa05] text-white p-5" />
        <CarouselNext className="absolute left-full  top-[90%] bg-[#e8aa05] text-white p-5" />
      </Carousel>
    </div>
  );
}

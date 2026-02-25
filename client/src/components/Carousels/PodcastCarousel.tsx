"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
  CarouselPrevious,
  CarouselNext, // Imported for better type safety
} from "@/src/components/ui/carousel";
import Image from "next/image";

const podcastImages = [
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?q=80&w=1170&auto=format&fit=crop",
];

const PodcastCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);


  return (
    <div className="w-[90%] m-auto">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          containScroll: "trimSnaps",
        }}
        className=""
      >
        <CarouselContent className="">
          {podcastImages.map((item, idx) => (
            <CarouselItem key={idx} className="basis-full sm:basis-1/2 lg:basis-1/3">
              <div className={`relative aspect-square overflow-hidden rounded-3xl m-2 duration-200 select-none shadow-xl
                    ${idx === selectedIndex + 1 ? "scale-100 z-50" : "scale-80"}
                    ${idx === selectedIndex  ? "transform-[translateX(120px)]" : ""}
                    ${idx === selectedIndex + 2 ? "transform-[translateX(-120px)]" : ""}
                `}>
                <Image
                  src={item}
                  alt={`podcast-${idx}`}
                  fill
                  draggable={false}
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </CarouselItem>
            
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-primary text-white p-5 shadow-xs active:shadow-none active:transform-[translateY(2px)]" />
        <CarouselNext className="bg-primary text-white p-5 shadow-xs active:shadow-none active:transform-[translateY(2px)]" />
      </Carousel>
    </div>
  );
};

export default PodcastCarousel;
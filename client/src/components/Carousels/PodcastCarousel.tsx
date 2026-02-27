"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
  CarouselPrevious,
  CarouselNext,
} from "@/src/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const podcastVideos = [
  "etgQjtdNEtc",
  "UKPkqrkgKmw",
  "OTvm5LfhDzg",
  "gB4dNxorewE",
  "Huam5sSRjwc",
  "QUDlpMN-f5w",
];

const PodcastCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Track selected slide
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

  // Disable scroll when modal open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
      api?.plugins()?.autoplay?.stop();
    } else {
      document.body.style.overflow = "";
      api?.plugins()?.autoplay?.play();
    }
  }, [activeVideo, api]);

  return (
    <>
      <div className="w-[90%] m-auto">
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          opts={{
            align: "center",
            containScroll: "trimSnaps",
            watchDrag: false,
          }}
        >
          <CarouselContent>
            {podcastVideos.map((videoId, idx) => (
              <CarouselItem
                key={idx}
                className="basis-full sm:basis-1/3 lg:basis-1/3"
              >
               <div
  onClick={() => setActiveVideo(videoId)}
  className={`cursor-pointer relative aspect-square overflow-hidden rounded-3xl m-2 duration-200 select-none border-2 border-white group
    ${
      idx === selectedIndex + 1
        ? "sm:scale-100 sm:z-50 scale-100"
        : "scale-80"
    }
    ${
      idx === selectedIndex
        ? "sm:transform-[translateX(120px)]"
        : ""
    }
    ${
      idx === selectedIndex + 2
        ? "transform-[translateX(-120px)]"
        : ""
    }
  `}
>
  {/* Thumbnail */}
  <img
    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
    alt="thumbnail"
    className="w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />

  {/* Play Button */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="black"
        className="w-6 h-6 sm:w-8 sm:h-8 ml-1"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  </div>
</div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="bg-primary left-0 sm:left-auto sm:right-full text-white p-5 shadow-xs active:shadow-none active:transform-[translateY(2px)]" />
          <CarouselNext className="bg-primary right-0 sm:right-auto sm:left-full text-white p-5 shadow-xs active:shadow-none active:transform-[translateY(2px)]" />
        </Carousel>
      </div>

      {/* MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-5xl aspect-video">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 text-white text-2xl font-bold"
            >
              ✕
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              title="Podcast Player"
              className="w-full h-full rounded-xl"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PodcastCarousel;
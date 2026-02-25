"use client";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  puffin,
  summertime,
  simon,
  brightbooks,
  pinkUnicorn,
  kalmbach,
} from "@/public/images";
import Image from "next/image";

const publishers = [
  puffin,
  summertime,
  simon,
  brightbooks,
  pinkUnicorn,
  kalmbach,
  puffin,
  summertime,
  simon,
  brightbooks,
  pinkUnicorn,
  kalmbach,
];

const PublisherCarousel = () => {
  return (
    <div className="main-container">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-[80%] m-auto"
      >
        <CarouselContent>
          {publishers?.map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/6"
            >
              <div className="p-1">
                <Card className="bg-[#dceefc]">
                  <CardContent>
                    <Image
                      src={publishers[index]}
                      alt={`Publisher ${index + 1}`}
                      className="aspect-square w-full h-full object-contain"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-primary p-5 text-white shadow-xs shadow-neutral-950 active:shadow-none active:transform-[translateY(2px)] border-none " />
        <CarouselNext className="bg-primary p-5 text-white shadow-xs shadow-neutral-950 active:shadow-none active:transform-[translateY(2px)] border-none " />
      </Carousel>
    </div>
  );
};

export default PublisherCarousel;

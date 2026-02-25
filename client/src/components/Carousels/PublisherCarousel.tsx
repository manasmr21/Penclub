"use client"
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
const PublisherCarousel = () => {
  return (
    <div>
      <Carousel
      plugins={[
        Autoplay({
          delay: 2000
        })
      ]}
        opts={{
          align: "start",
        }}
        className="w-[50%] m-auto"
      >
        <CarouselContent>
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default PublisherCarousel;

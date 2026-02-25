"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { mati, romance, mystery, scifi, fantasy } from "@/public/images";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";

const categories = [
  {
    img: mati,
    name: "Mati",
  },
  {
    img: romance,
    name: "Romance",
  },
  {
    img: mystery,
    name: "Mystery & thriller",
  },
  {
    img: scifi,
    name: "Science fiction",
  },
  {
    img: fantasy,
    name: "Fantasy",
  },
  {
    img: mati,
    name: "Mati",
  },
  {
    img: romance,
    name: "Romance",
  },
  {
    img: mystery,
    name: "Mystery & thriller",
  },
  {
    img: scifi,
    name: "Science fiction",
  },
  {
    img: fantasy,
    name: "Fantasy",
  },
];

const CategoryCarousel = () => {
  return (
    <>
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
        className=" w-[70%] m-auto select-none"
      >
        <CarouselContent>
          {categories?.map((item, idx) => (
            <CarouselItem
              key={idx}
              className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center flex-col">
                    <Image src={item.img} alt="" />
                    <p className="font-semibold text-xl text-center">{item.name}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};

export default CategoryCarousel;

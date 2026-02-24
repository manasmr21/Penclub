"use client";

import Image from "next/image";
import { cloud, cloud2 } from "@/public/images";
import HeroCarousel from "@/src/components/Carousels/HeroCarousel";

const Hero = () => {
  return (
    <div className="section-hero">
      <div className="section-container main-container text-primary">
        <div className="pt-24 lg:pt-32">

          {/* Clouds */}
          <div className="cloud-images flex justify-between w-full">
            <Image src={cloud} alt="cloud" width={250} height={80} />
            <Image src={cloud2} alt="cloud" width={250} height={80} />
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row justify-between items-start w-[95%]">

            {/* LEFT SIDE */}
            <div className="left-content max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
                <p>
                  Where{" "}
                  <span className="font-rouge font-bold text-5xl sm:text-6xl lg:text-7xl text-secondary">
                    stories
                  </span>{" "}
                  find
                </p>
                <p>
                  their{" "}
                  <span className="font-rouge font-bold text-5xl sm:text-6xl lg:text-7xl text-secondary">
                    voice
                  </span>
                </p>
              </h2>

              <button className="mt-8 bg-[#ea6312] cursor-pointer text-white text-lg sm:text-xl py-3 px-8 shadow-xl shadow-[#eeb75c] rounded-full hover:scale-105 transition">
                Explore
              </button>
            </div>

            {/* RIGHT SIDE (CAROUSEL LOWERED) */}
            <div className="right-carousel w-full lg:w-auto mt-12 lg:mt-24">
              <HeroCarousel />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
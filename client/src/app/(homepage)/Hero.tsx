"use client";

import Image from "next/image";
import { cloud, cloud2 } from "@/public/images";
import HeroCarousel from "@/src/components/Carousels/HeroCarousel";
import Strip from "./Strip";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero bg-background min-h-screen flex flex-col justify-between">
      
      <div className="section-hero pt-6 md:pt-10 flex flex-col flex-1">
        
        {/* CLOUDS */}
        <div className="upper-content w-[90%] max-w-[1400px] mx-auto flex justify-between items-start">
          <Image
            src={cloud}
            alt="cloud"
            className="w-[120px] md:w-[200px] lg:w-[300px] h-auto"
          />
          <Image
            src={cloud2}
            alt="cloud"
            className="w-[120px] md:w-[200px] lg:w-[300px] h-auto"
          />
        </div>

        {/* MIDDLE SECTION */}
        <div className="middle-content w-[80%] max-w-[1920px] mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 flex-1 py-8">
          
          {/* LEFT SIDE (SHIFTED UP) */}
          <div className="left-sect text-center lg:text-left lg:-translate-y-12 xl:-translate-y-16 transition-transform duration-300">
            
            <div className="leading-tight">
              <p className="text-primary text-[clamp(1.8rem,4vw,4rem)]">
                Where{" "}
                <span className="font-rouge text-secondary font-semibold">
                  stories
                </span>{" "}
                find
              </p>
              <p className="text-primary text-[clamp(1.8rem,4vw,4rem)]">
                their{" "}
                <span className="font-rouge text-secondary font-semibold">
                  voices
                </span>
              </p>
            </div>

            <button className="mt-6 text-sm md:text-lg uppercase bg-[#ea6312] text-white rounded-full px-8 py-2 shadow-xl shadow-[#ecb150] hover:scale-105 transition-all duration-300">
              Explore
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="right-sect w-full max-w-[600px]">
            <HeroCarousel />
          </div>
        </div>
      </div>

      {/* STRIP */}
      <div className="bottom-content">
        <Strip />
      </div>
    </section>
  );
};

export default Hero;
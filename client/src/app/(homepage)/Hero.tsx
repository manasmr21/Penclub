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
        <div className="main-container">
          {/* CLOUDS */}
          <div className="upper-content w-[90%] max-w-[1400px] mx-auto flex justify-between items-start">
            <Image
              src={cloud}
              alt="cloud"
              className="cloud-1 w-[120px] md:w-[200px] lg:w-[300px] h-auto"
            />
            <Image
              src={cloud2}
              alt="cloud"
              className="cloud-2 w-[120px] md:w-[200px] lg:w-[300px] h-auto"
            />
          </div>

          {/* MIDDLE SECTION */}
          <div className="middle-content w-[95%] max-w-[1920px] 2xl:m-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 flex-1 py-8">
            {/* LEFT SIDE (SHIFTED UP) */}
            <div className="left-sect text-center lg:text-left lg:-translate-y-12 xl:-translate-y-20 transition-transform duration-300">
              <div className="leading-[60px] font-quicksand text-[clamp(3rem,3.5vw,6rem)]">
                <p className="text-primary font-semibold ">
                  Where{" "}
                  <span className="font-gveret text-secondary font-semibold">
                    stories
                  </span>{" "}
                  find
                </p>
                <p className="text-primary font-semibold ">
                  their{" "}
                  <span className="font-gveret text-secondary font-semibold">
                    voice
                  </span>
                </p>
              </div>

              <button className="cursor-pointer mt-8 text-sm text-[clamp(1rem,1.2vw,2rem)] uppercase bg-[#ea6312] text-white rounded-full px-8 py-2 shadow-xl shadow-[#ecb150] hover:scale-105 transition-all duration-100 active:scale-[0.98]">
                Explore
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="right-sect w-full max-w-[600px] 2xl:max-w-[900px]">
              <HeroCarousel />
            </div>
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

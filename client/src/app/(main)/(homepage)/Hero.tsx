"use client";

import Image from "next/image";
import { cloud, cloud2 } from "@/public/images";
import HeroCarousel from "@/src/components/Carousels/HeroCarousel";
import Strip from "./Strip";

const Hero = () => {
  return (
    <section
      id="magazine"
      className="hero bg-background min-h-screen min-[1700px]:min-h-[850px] min-[1700px]:max-h-[950px] flex flex-col justify-between"
    >
      <div className="section-hero pt-6 md:pt-10 flex flex-col flex-1">
        <div className="main-container flex flex-col flex-1 justify-center">
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
          <div className="middle-content w-[95%] max-w-[1920px] 2xl:m-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-10 flex-1 py-4 md:py-8">
            {/* LEFT SIDE */}
            <div className="left-sect flex-1 min-w-0 text-center lg:text-left lg:-translate-y-12 xl:-translate-y-20 min-[1700px]:translate-y-0 transition-transform duration-300">
              <div className="leading-[1.15] md:leading-[1.1] font-quicksand text-[clamp(2.2rem,4.5vw,5.5rem)] min-[1700px]:text-[4.8rem]">
                <p className="text-primary font-semibold">
                  Where{" "}
                  <span className="font-gveret text-secondary font-semibold text-[1.15em] inline-block">
                    stories
                  </span>{" "}
                  find
                </p>
                <p className="text-primary font-semibold">
                  their{" "}
                  <span className="font-gveret text-secondary font-semibold text-[1.15em] inline-block">
                    voice
                  </span>
                </p>
              </div>

              <button className="cursor-pointer mt-6 md:mt-8 text-sm md:text-base lg:text-lg uppercase bg-[#ea6312] text-white rounded-full px-6 py-2.5 md:px-8 md:py-3 shadow-md md:shadow-xl shadow-[#ecb150]/40 hover:scale-105 transition-all duration-100 active:scale-[0.98] hover:shadow-lg md:hover:shadow-2xl">
                Explore
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="right-sect flex-1 min-w-0 w-full max-w-[600px] lg:max-w-[450px] xl:max-w-[600px] 2xl:max-w-[900px] lg:translate-y-6 xl:translate-y-10 min-[1700px]:translate-y-0 transition-transform duration-300">
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

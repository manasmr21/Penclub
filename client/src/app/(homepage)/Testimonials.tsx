import Image from "next/image";
import React from "react";

const imgUrl =
  "https://images.unsplash.com/photo-1755747394416-5de192036835?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const Testimonials = () => {
  return (
    <div className="section-testimonials bg-white py-20 overflow-hidden">
      <div className="main-container relative">
        <div className="background bg-transparent flex justify-between">
          <div className=" transform-[translateY(-110px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img aspect-square relative w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
          </div>
          <div className=" transform-[translateY(-180px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img aspect-square relative w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
          </div>
          <div className=" transform-[translateY(-140px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
          </div>
          <div className=" transform-[translateY(-180px)]" >
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
          </div>
          <div className=" transform-[translateY(-160px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
          </div>
          <div className=" transform-[translateY(-180px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
          </div>
          <div className=" transform-[translateY(-140px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
          </div>
          <div className=" transform-[translateY(-180px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img aspect-square relative w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
            <div className="img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
          </div>
          <div className=" transform-[translateY(-110px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img aspect-square relative w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
            <div className="img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={imgUrl} alt="some image" className="w-full" />
            </div>
          </div>
        </div>
        <div className="curtain text-center absolute w-full top-1/2">
            <p className="py-1 font-semibold text-black w-[110px] m-auto rounded-2xl bg-gray-200 mb-10">Testimonials</p>
            <div>
                <p className="text-black text-6xl font-inter">Trusted by leaders</p>
                <p className="text-gray-400 text-6xl font-inter">from various industries</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

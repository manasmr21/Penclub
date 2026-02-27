import Image from "next/image";
import React from "react";

const imgUrl =
  "https://images.unsplash.com/photo-1755747394416-5de192036835?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const personImages = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?q=80&w=1170&auto=format&fit=crop",
];


const Testimonials = () => {
  console.log(personImages.length)
  return (
    <div className="section-testimonials bg-white py-20 overflow-hidden main-container">
      <div className=" max-w-[1400px] m-auto relative">
        <div className="background bg-transparent flex justify-between transform-[translateX(-45%)] md:transform-[translateX(-35%)] lg:transform-none">
          <div className=" transform-[translateY(-110px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img aspect-square relative w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[0]} alt="some image" className="w-full object-cover" />
            </div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[1]} alt="some image" className="w-full object-cover" />
            </div>
          </div>
          <div className=" transform-[translateY(-180px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img aspect-square relative w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[2]} alt="some image" className="w-full object-cover" />
            </div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[3]} alt="some image" className="w-full object-cover" />
            </div>
          </div>
          <div className=" transform-[translateY(-140px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[4]} alt="some image" className="w-full object-cover" />
            </div>
          </div>
          <div className=" transform-[translateY(-180px)]" >
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[5]} alt="some image" className="w-full object-cover" />
            </div>
          </div>
          <div className=" transform-[translateY(-160px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[6]} alt="some image" className="w-full object-cover" />
            </div>
          </div>
          <div className=" transform-[translateY(-180px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[7]} alt="some image" className="w-full object-cover" />
            </div>
          </div>
          <div className=" transform-[translateY(-140px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[8]} alt="some image" className="w-full object-cover" />
            </div>
          </div>
          <div className=" transform-[translateY(-180px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img aspect-square relative w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[9]} alt="some image" className="w-full object-cover" />
            </div>
            <div className="img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[10]} alt="some image" className="w-full object-cover" />
            </div>
          </div>
          <div className=" transform-[translateY(-110px)]">
            <div className=" testimonial-card blank w-[130px] h-[150px] bg-gray-50 rounded-2xl overflow-hidden mt-2"></div>
            <div className=" testimonial-card img aspect-square relative w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[11]} alt="some image" className="w-full object-cover" />
            </div>
            <div className="img relative aspect-square w-[130px] h-[150px] rounded-2xl overflow-hidden mt-2">
              <Image fill src={personImages[12]} alt="some image" className="w-full object-cover" />
            </div>
          </div>
        </div>
        <div className="curtain text-center absolute w-full top-1/2">
            <p className="py-1 font-semibold text-black w-[110px] m-auto rounded-2xl bg-gray-200 mb-10">Testimonials</p>
            <div className="font-semibold">
                <p className="text-black text-4xl md:text-6xl font-inter">Trusted by leaders</p>
                <p className="text-gray-400 text-4xl md:text-6xl font-inter">from various industries</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

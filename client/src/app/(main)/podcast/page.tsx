"use client";

import React from "react";
import { motion } from "motion/react";
import { Play, Mic, Headphones, Clock, Calendar, ArrowRight, Volume2, Share2 } from "lucide-react";
import Link from "next/link";

const episodes = [
  {
    id: 1,
    title: "The Future of Digital Publishing",
    guest: "Dr. Elena Vance",
    date: "Oct 24, 2023",
    duration: "45 min",
    category: "Industry",
    description: "Dr. Vance discusses how blockchain and AI are reshaping the landscape for independent authors and publishers.",
    image: "https://images.unsplash.com/photo-1478737270239-2fccd2c40c4a?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Poetry in the Modern Era",
    guest: "Marcus Thorn",
    date: "Oct 18, 2023",
    duration: "32 min",
    category: "Creative",
    description: "Exploring why short-form poetry is thriving in the age of social media and how classic forms are evolving.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Writing for the Screen",
    guest: "Sarah Jenkins",
    date: "Oct 10, 2023",
    duration: "58 min",
    category: "Screenwriting",
    description: "Acclaimed screenwriter Sarah Jenkins shares her process for translating complex novels into compelling cinema.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "The Art of the Interview",
    guest: "Jameson Burke",
    date: "Oct 02, 2023",
    duration: "41 min",
    category: "Journalism",
    description: "Mastering the subtle craft of asking the right questions to uncover deep, personal stories from reticent subjects.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1974&auto=format&fit=crop"
  }
];

const PodcastPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-28 pb-12 border-b border-primary/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 space-y-4"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/10">
                <Mic size={14} className="text-primary" />
                <span className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-primary">Official Podcast</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif font-black text-primary tracking-tighter leading-none">
                Voices of the <br /> <span className="italic font-normal">Pen Club.</span>
              </h1>
              
              <p className="text-xl font-serif italic text-primary/60 max-w-lg leading-relaxed">
                Weekly conversations with the world's most provocative thinkers, authors, and creative renegades.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-primary text-white px-10 py-5 font-sans font-black text-[11px] uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-3">
                  <Play size={14} fill="white" /> Listen Now
                </button>
                <div className="flex items-center gap-4 px-6 border border-primary/10">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-primary/40">Available on</span>
                  <div className="flex gap-3 text-primary/60">
                    <Headphones size={16} />
                    <Volume2 size={16} />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 relative aspect-square"
            >
              <div className="absolute inset-0 bg-primary/5 -rotate-3 translate-x-4 translate-y-4 border border-primary/10"></div>
              <img 
                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1974&auto=format&fit=crop" 
                alt="Studio setup" 
                className="w-full h-full object-cover relative z-10"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-8 z-20 hidden md:block">
                <p className="text-[10px] font-sans font-black uppercase tracking-[0.3em] mb-2 opacity-50">New Episode</p>
                <p className="text-xl font-serif font-bold italic leading-tight">"The Architecture of a Bestseller"</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories & Filter */}
      <section className="py-12 border-b border-primary/5 bg-primary/[0.02]">
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <div className="flex items-center gap-10 whitespace-nowrap">
            <span className="text-[11px] font-sans font-black uppercase tracking-widest text-primary">Browse:</span>
            {["All", "Literature", "Industry", "Creative", "Interviews", "Tech"].map((cat) => (
              <button key={cat} className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors cursor-pointer">
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Episode Grid */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 flex justify-between items-end">
            <div>
              <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary/30 block mb-4">The Archives</span>
              <h2 className="text-4xl font-serif font-black text-primary tracking-tighter">Recent Transmissions</h2>
            </div>
            <button className="text-[10px] font-sans font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-4 transition-all pb-2 border-b border-primary/20">
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {episodes.map((ep, i) => (
              <motion.div 
                key={ep.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="group cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 aspect-square overflow-hidden bg-primary/5">
                    <img 
                      src={ep.image} 
                      alt={ep.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-sans font-black uppercase tracking-widest text-primary/30">{ep.category}</span>
                      <div className="flex items-center gap-2 text-[9px] font-sans font-bold text-primary/30 uppercase tracking-widest">
                        <Clock size={10} /> {ep.duration}
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif font-black text-primary leading-tight group-hover:italic transition-all">
                      {ep.title}
                    </h3>
                    <p className="text-sm font-sans font-bold text-primary/40 uppercase tracking-widest">{ep.guest}</p>
                    <p className="text-sm font-serif italic text-primary/60 line-clamp-2 leading-relaxed">
                      {ep.description}
                    </p>
                    <div className="flex items-center gap-6 pt-2">
                      <button className="flex items-center gap-2 text-[9px] font-sans font-black uppercase tracking-widest text-primary">
                        <Play size={12} fill="currentColor" /> Play Episode
                      </button>
                      <button className="text-primary/20 hover:text-primary transition-colors">
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
          <div className="inline-block p-4 border border-white/20">
            <Volume2 className="text-white" size={32} />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-white tracking-tighter">
            Never miss <br /> a frequency.
          </h2>
          <p className="text-xl font-serif italic text-white/60 max-w-xl mx-auto">
            Subscribe to our weekly dispatch and get behind-the-scenes access to our recording sessions.
          </p>
          <form className="max-w-md mx-auto flex gap-4 pt-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-white/10 border border-white/20 px-6 py-4 text-white font-serif italic placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-all"
            />
            <button className="bg-white text-primary px-8 py-4 font-sans font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PodcastPage;

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Mic, Headphones, Clock, Calendar, ArrowRight, Volume2, Share2, Sparkles, Disc } from "lucide-react";
import AnimateIn from "@/src/components/ui/AnimateIn";
import ArchivalRepositoryCard from "@/src/components/ArchivalRepositoryCard";

const episodes = [
  {
    id: 1,
    title: "The Future of Digital Publishing",
    guest: "Dr. Elena Vance",
    date: "Oct 24, 2026",
    duration: "45 min",
    category: "Industry",
    description: "Dr. Vance discusses how blockchain and AI are reshaping the landscape for independent authors and publishers.",
    image: "/podcast_featured_cover.png"
  },
  {
    id: 2,
    title: "Poetry in the Modern Era",
    guest: "Marcus Thorn",
    date: "Oct 18, 2026",
    duration: "32 min",
    category: "Creative",
    description: "Exploring why short-form poetry is thriving in the age of social media and how classic forms are evolving.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Writing for the Screen",
    guest: "Sarah Jenkins",
    date: "Oct 10, 2026",
    duration: "58 min",
    category: "Screenwriting",
    description: "Acclaimed screenwriter Sarah Jenkins shares her process for translating complex novels into compelling cinema.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "The Art of the Interview",
    guest: "Jameson Burke",
    date: "Oct 02, 2026",
    duration: "41 min",
    category: "Journalism",
    description: "Jameson shares his secrets for building deep rapport with reticent subjects to elicit vulnerable, profound disclosures.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1974&auto=format&fit=crop"
  }
];

export default function PodcastPage() {
  const [activeEpisode, setActiveEpisode] = useState(episodes[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDF9F0] text-[#1D4E89] font-sans pb-24 relative overflow-hidden">

      {/* Ghosted Background Editorial Watermarks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute left-[-5vw] top-[15vh] text-[12vw] font-serif font-black text-[#1D4E89]/[0.025] tracking-widest -rotate-12 uppercase">
          Voices
        </div>
        <div className="absolute right-[-8vw] top-[35vh] text-[15vw] font-sans font-black text-[#1D4E89]/[0.02] tracking-[0.2em] rotate-90 uppercase">
          Broadcast
        </div>
        <div className="absolute left-[-2vw] bottom-[25vh] text-[11vw] font-serif italic font-normal text-[#E6693E]/[0.025] tracking-wide rotate-6 uppercase">
          Frequency
        </div>

      </div>

      {/* Broadsheet Broadcast Header */}
      <header className="max-w-7xl mx-auto px-8 pt-20 pb-12 border-b border-[#1D4E89]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <AnimateIn variant="fade-up" delay={0}>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#E6693E]">
                <Mic size={12} />
                <span>Official Broadcaster</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight leading-none text-gray-900">
                Voices of the <br />
                <span className="italic font-normal text-[#1D4E89]">Pen Club.</span>
              </h1>
            </div>
          </AnimateIn>
          <AnimateIn variant="fade-left" delay={0.15}>
            <p className="text-sm md:text-base font-serif italic text-gray-500 max-w-sm leading-relaxed">
              A weekly digital frequency featuring raw discussions with world-renowned authors, editors, and publishing mavericks.
            </p>
          </AnimateIn>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pt-12">
        {/* Bespoke Interactive Live Player Deck (Unique Visual Station!) */}
        <AnimateIn variant="fade-up" delay={0}>
          <section className="mb-24 flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="w-full md:w-5/12 aspect-square rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer bg-gray-100">
              <img 
                src={activeEpisode.image} 
                alt={activeEpisode.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1478737270239-2fccd2c40c4a?q=80&w=2070&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-16 h-16 rounded-full bg-[#E6693E] flex items-center justify-center">
                  {isPlaying ? <Pause fill="white" /> : <Play fill="white" className="translate-x-0.5" />}
                </div>
              </button>
            </div>
            
            <div className="w-full md:w-7/12 space-y-6">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#E6693E]">
                <span className="w-2 h-2 rounded-full bg-[#E6693E] animate-pulse" />
                Now Streaming
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tight leading-[1.1] text-gray-900">
                "{activeEpisode.title}"
              </h2>
              <div className="flex items-center gap-4 text-xs font-bold text-[#1D4E89]/60 uppercase tracking-widest">
                <span>Guest: {activeEpisode.guest}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{activeEpisode.duration}</span>
              </div>
              <p className="text-base font-serif italic text-gray-500 leading-relaxed max-w-xl">
                {activeEpisode.description}
              </p>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-4 bg-[#1D4E89] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                {isPlaying ? "Pause transmission" : "Listen to broadcast"}
              </button>
            </div>
          </section>
        </AnimateIn>

        {/* High-End Magazine Index Column Grid Layout (Highly Unique!) */}
        <section className="mt-20">
          <div className="mb-12 border-b border-[#1D4E89]/10 pb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Library of Dispatches</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {episodes.map((ep, idx) => (
              <AnimateIn key={ep.id} variant="fade-up" delay={idx * 0.1}>
                <div
                  onClick={() => {
                    setActiveEpisode(ep);
                    setIsPlaying(false);
                  }}
                  className={`group cursor-pointer flex gap-6 p-4 rounded-2xl border transition-all duration-300 ${activeEpisode.id === ep.id ? "bg-white border-gray-100 shadow-md" : "border-transparent hover:bg-white/40"}`}
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100 bg-gray-50">
                    <img
                      src={ep.image}
                      alt={ep.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/images/podcast.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>{ep.category}</span>
                        <span>{ep.duration}</span>
                      </div>
                      <h3 className="text-base font-serif font-black text-gray-900 group-hover:text-[#1D4E89] leading-snug line-clamp-2">
                        {ep.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">By {ep.guest}</p>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#E6693E] inline-flex items-center gap-1 mt-2">
                      Load Deck <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </section>
      </main>

      {/* Subscribe Newsletter Station */}
      <ArchivalRepositoryCard
        showNewsletterForm
        type="audio"
        label="Weekly Frequency"
        mainTitle="Never miss a"
        italicTitle="frequency"
        description="Subscribe to get immediate notification when our digital transmissions broadcast."
        badgeLabel="Transmissions"
        badgeIcon={Disc}
        indexNo="FREQ: 104.2"
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";
import AnimateIn from "@/src/components/ui/AnimateIn";
import ArchivalRepositoryCard from "@/src/components/ArchivalRepositoryCard";

const upcomingEvents = [
  {
    id: 1,
    title: "The Midnight Reading: Gothic Special",
    date: "12",
    month: "NOV",
    year: "2026",
    time: "21:00 - 00:00",
    location: "The Silver City Library, Cuttack",
    type: "In-Person",
    description: "An atmospheric evening of Odia gothic literature, read by candlelight in the heart of Cuttack's historic quarter.",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Odisha Literary Meet 2026",
    date: "05",
    month: "DEC",
    year: "2026",
    time: "10:00 - 18:00",
    location: "Exhibition Ground, Bhubaneswar",
    type: "Hybrid",
    description: "Join 50+ award-winning authors and thinkers for a day of panels, workshops, and exclusive manuscript previews.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Workshop: The Anatomy of a Short Story",
    date: "14",
    month: "JAN",
    year: "2027",
    time: "14:00 - 17:00",
    location: "The Studio, Puri",
    type: "Workshop",
    description: "A hands-on intensive focusing on narrative structure and pacing, held by the serene coastline of Puri.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop"
  }
];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-[#FDF9F0] text-[#1D4E89] font-sans pb-24 relative overflow-hidden">

      {/* Ghosted Background Editorial Watermarks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute left-[-5vw] top-[15vh] text-[12vw] font-serif font-black text-[#1D4E89]/[0.025] tracking-widest -rotate-12 uppercase">
          Gatherings
        </div>
        <div className="absolute right-[-8vw] top-[35vh] text-[15vw] font-sans font-black text-[#1D4E89]/[0.02] tracking-[0.2em] rotate-90 uppercase">
          Symposium
        </div>
        <div className="absolute left-[-2vw] bottom-[25vh] text-[11vw] font-serif italic font-normal text-[#E6693E]/[0.025] tracking-wide rotate-6 uppercase">
          Ledger
        </div>
        <div className="absolute right-[5vw] top-[75vh] text-[10vw] font-serif font-bold text-[#1D4E89]/[0.02] tracking-widest -rotate-6 uppercase">
          Expressions
        </div>
      </div>

      {/* Editorial Header Section */}
      <header className="max-w-7xl mx-auto px-8 pt-20 pb-12 border-b border-[#1D4E89]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <AnimateIn variant="fade-up" delay={0}>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#E6693E]">
                <Sparkles size={12} />
                <span>Timeline MMXXVI</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight leading-none text-gray-900">
                The Ledger of <br />
                <span className="italic font-normal text-[#1D4E89]">Gatherings.</span>
              </h1>
            </div>
          </AnimateIn>
          <AnimateIn variant="fade-left" delay={0.15}>
            <p className="text-sm md:text-base font-serif italic text-gray-500 max-w-sm leading-relaxed">
              From atmospheric candlelit readings in historical quarters to state-wide symposiums—explore our curated calendar of gatherings.
            </p>
          </AnimateIn>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pt-12">
        {/* Asymmetrical Featured Broadcast Split */}
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <AnimateIn variant="fade-right" delay={0} className="lg:col-span-7">
            <div className="relative group rounded-2xl overflow-hidden shadow-xl aspect-[16/10]">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
                alt="Featured Gala"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-[#E6693E] rounded-full">Spotlight Gala</span>
                <h3 className="text-2xl font-serif font-bold">The Bhubaneswar Winter Symposium</h3>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn variant="fade-left" delay={0.15} className="lg:col-span-5">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E6693E]">
                <span>15 DEC 2026</span>
                <span className="w-6 h-[1px] bg-[#E6693E]" />
                <span>BHUBANESWAR</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight leading-snug text-gray-900">
                Pen Club Winter Gala: <br />
                <span className="font-normal italic text-[#1D4E89]">The Grand Chapter</span>
              </h2>
              <p className="text-sm font-serif text-gray-500 leading-relaxed italic">
                A prestigious seasonal gathering of minds and expressions. Formal attire, deep discourse, manuscript unveilings, and live acoustic recitals.
              </p>
              <button className="bg-[#1D4E89] text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all cursor-pointer shadow-md active:scale-95">
                Request Exclusive Invitation
              </button>
            </div>
          </AnimateIn>
        </section>

        {/* Chronological Row Ledger Section (Unique Horizontal Experience!) */}
        <section className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1D4E89]/10 pb-4 mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Chronological Ledger</h3>
            <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              {["All", "Bhubaneswar", "Cuttack", "Puri"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer transition-colors ${activeCategory === cat ? "text-[#E6693E]" : "hover:text-[#1D4E89]"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Horizontal Rows */}
          <div className="divide-y divide-[#1D4E89]/10 border-b border-[#1D4E89]/10">
            {upcomingEvents.map((event, idx) => (
              <AnimateIn key={event.id} variant="fade-up" delay={idx * 0.08}>
                <div
                  className="group relative py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:px-4 cursor-pointer"
                >
                  {/* Floating Preview Image on Hover */}
                  <div className="flex items-center gap-6 md:w-1/2">
                    <div className="flex items-baseline gap-2 shrink-0">
                      <span className="text-4xl font-serif font-black tracking-tighter text-[#E6693E] group-hover:italic">
                        {event.date}
                      </span>
                      <div className="flex flex-col text-[10px] font-black text-[#1D4E89] tracking-widest">
                        <span>{event.month}</span>
                        <span className="opacity-30">{event.year}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                        {event.type}
                      </span>
                      <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-[#1D4E89] transition-colors leading-snug">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:items-center justify-between md:w-1/2 gap-4">
                    <p className="text-xs text-gray-500 max-w-sm italic font-serif leading-relaxed line-clamp-2 md:line-clamp-1">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex flex-col text-[10px] text-gray-400 font-bold tracking-wider">
                        <span className="flex items-center gap-1"><Clock size={10} /> {event.time}</span>
                        <span className="flex items-center gap-1 mt-0.5"><MapPin size={10} /> {event.location.split(',')[1] || event.location}</span>
                      </div>
                      <button className="w-8 h-8 rounded-full border border-gray-200 group-hover:bg-[#1D4E89] group-hover:text-white flex items-center justify-center transition-all">
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Animated Background Hover Block */}
                  <div className="absolute inset-0 bg-white/40 -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm" />
                </div>
              </AnimateIn>
            ))}
          </div>
        </section>
      </main>

      <ArchivalRepositoryCard />
    </div>
  );
}

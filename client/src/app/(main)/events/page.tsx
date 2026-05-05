"use client";

import React from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Clock, ArrowRight, Ticket, Users, Share2, Plus } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "The Midnight Reading: Gothic Special",
    date: "12",
    month: "NOV",
    year: "2023",
    time: "21:00 - 00:00",
    location: "The Silver City Library, Cuttack",
    type: "In-Person",
    description: "An atmospheric evening of Odia gothic literature, read by candlelight in the heart of Cuttack's historic quarter.",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Odisha Literary Meet 2023",
    date: "05",
    month: "DEC",
    year: "2023",
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
    year: "2024",
    time: "14:00 - 17:00",
    location: "Pen Club Atelier, Puri",
    type: "Workshop",
    description: "A hands-on intensive focusing on narrative structure and pacing, held by the serene coastline of Puri.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop"
  }
];

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-primary">
      {/* Static Background Lettering */}
      <div className="fixed top-0 right-0 pointer-events-none opacity-[0.02] z-0 mt-32 mr-6">
        <h1 className="text-[12vw] font-serif font-black leading-none uppercase tracking-tighter [writing-mode:vertical-lr] select-none">
          Events
        </h1>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Editorial Hero */}
        <div className="border-l border-primary/20 pl-10 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Timeline MMXXIII</span>
            <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter leading-none">
              The Ledger of <br /> <span className="italic font-normal">Gatherings.</span>
            </h1>
            <p className="text-xl font-serif italic text-primary/60 max-w-xl">
              From candlelit readings in historic quarters to state-wide literary meets—explore the curated calendar of the Pen Club community in Odisha.
            </p>
          </motion.div>
        </div>

        {/* Focus Section: Featured Event */}
        <div className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-primary/20">
            <div className="lg:col-span-8 relative aspect-[16/9] lg:aspect-auto overflow-hidden bg-primary/5">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" 
                alt="Featured Gala" 
                className="w-full h-full object-cover transition-all duration-1000"
              />
              <div className="absolute top-8 left-8 bg-white px-6 py-3 border border-primary/10">
                <span className="text-[10px] font-black uppercase tracking-widest">Featured Transmission</span>
              </div>
            </div>
            <div className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-between bg-primary/[0.02]">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-serif font-black italic">15</span>
                  <div className="h-px flex-1 bg-primary/20"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">DEC 2023</span>
                </div>
                <h2 className="text-4xl font-serif font-black leading-tight tracking-tighter">
                  Pen Club <br /> Winter Gala: <br /> <span className="italic font-normal">The Bhubaneswar Chapter</span>
                </h2>
                <p className="text-sm font-serif text-primary/60 leading-relaxed italic">
                  A grand celebration of literature and art in the heart of Bhubaneswar. Formal attire, deep discourse, and open minds.
                </p>
              </div>
              <button className="w-full mt-12 bg-primary text-white py-5 font-black text-[10px] uppercase tracking-[0.3em] border border-primary hover:bg-transparent hover:text-primary transition-all cursor-pointer">
                Request Invitation
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="space-y-0">
          <div className="flex items-center justify-between mb-12 pb-4 border-b border-primary/20">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30">Upcoming Dispatch</h3>
            <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-primary/40">
              <button className="hover:text-primary transition-colors cursor-pointer">Filter: All</button>
              <button className="hover:text-primary transition-colors cursor-pointer">Bhubaneswar</button>
              <button className="hover:text-primary transition-colors cursor-pointer">Cuttack</button>
              <button className="hover:text-primary transition-colors cursor-pointer">Puri</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-primary/20">
            {upcomingEvents.map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="group border-r border-b border-primary/20 p-8 hover:bg-primary/[0.01] transition-colors"
              >
                <div className="flex flex-col h-full space-y-8">
                  {/* Date Header */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-serif font-black tracking-tighter group-hover:italic transition-all">
                      {event.date}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{event.month}</span>
                      <span className="text-[8px] font-bold text-primary/30 uppercase tracking-[0.2em]">{event.year}</span>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden transition-all duration-700">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-primary text-white">{event.type}</span>
                      <div className="flex items-center gap-2 text-[11px] font-sans font-bold text-primary/30 uppercase tracking-widest">
                        <Clock size={10} /> {event.time}
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif font-black leading-tight tracking-tighter">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-serif italic text-primary/40">
                      <MapPin size={12} className="text-primary/20" /> {event.location}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-6 border-t border-primary/10 flex justify-between items-center">
                    <a href="#" className="text-[11px] font-black uppercase tracking-widest flex items-center gap-3 group/link hover:italic transition-all">
                      Secure Access <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                    </a>
                    <button className="p-2 border border-primary/10 hover:bg-primary hover:text-white hover:rotate-90 transition-all cursor-pointer">
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Archival CTA */}
        <div className="mt-32 p-12 bg-primary text-white flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h2 className="text-4xl font-serif font-black tracking-tighter leading-none italic">
              History is in the <br /> <span className="font-normal not-italic">Making.</span>
            </h2>
            <p className="text-white/60 font-serif italic">
              Explore our archival footage and transcriptions from past Pen Club gatherings across Odisha.
            </p>
          </div>
          <button className="px-12 py-5 border border-white/20 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-primary transition-all whitespace-nowrap">
            View Archives
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

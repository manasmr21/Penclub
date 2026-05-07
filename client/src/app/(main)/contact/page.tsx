"use client";

import React from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Youtube, ArrowUpRight, Clock } from "lucide-react";
import AnimateIn from "@/src/components/ui/AnimateIn";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDF9F0] text-[#1D4E89] font-sans pb-24">
      
      {/* Broadsheet Editorial Header */}
      <header className="max-w-7xl mx-auto px-8 pt-20 pb-12 border-b border-[#1D4E89]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <AnimateIn variant="fade-up" delay={0}>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#E6693E]">
                <Mail size={12} />
                <span>Correspondence Office</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight leading-none text-gray-900">
                The Atelier <br />
                <span className="italic font-normal text-[#1D4E89]">Dispatch.</span>
              </h1>
            </div>
          </AnimateIn>
          <AnimateIn variant="fade-left" delay={0.15}>
            <p className="text-sm md:text-base font-serif italic text-gray-500 max-w-sm leading-relaxed">
              Whether you seek to collaborate on upcoming publications, publish broadside articles, or secure residency, let us correspond.
            </p>
          </AnimateIn>
        </div>
      </header>

      {/* Main Correspondence Content Grid (Unique Two-Column Broadsheet Structure!) */}
      <main className="max-w-7xl mx-auto px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Inquiry Form Box */}
          <AnimateIn variant="fade-right" delay={0} className="lg:col-span-7">
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 space-y-10">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E6693E]">Atelier Inquiry</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
                Transmit your <span className="italic font-normal text-[#1D4E89]">inquiry</span>
              </h2>
            </div>

            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#1D4E89] focus:bg-white transition-all text-sm font-medium text-gray-800" 
                    placeholder="E.g., Marcus Aurelius" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#1D4E89] focus:bg-white transition-all text-sm font-medium text-gray-800" 
                    placeholder="E.g., marcus@domain.com" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Select Topic</label>
                <div className="flex flex-wrap gap-2">
                  {["Collaborations", "Membership", "Press", "General"].map((topic, i) => (
                    <button 
                      key={topic} 
                      type="button" 
                      className={`px-4 py-2 border rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${i === 0 ? "bg-[#1D4E89] text-white border-[#1D4E89]" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Message</label>
                <textarea 
                  id="message" 
                  rows={5} 
                  required 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#1D4E89] focus:bg-white transition-all text-sm font-serif italic text-gray-800 resize-none" 
                  placeholder="Tell us your narrative..."
                ></textarea>
              </div>

              <button className="w-full sm:w-auto bg-[#E6693E] hover:bg-opacity-90 text-white px-10 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95">
                Transmit <Send size={12} />
              </button>
            </form>
          </section>
          </AnimateIn>

          {/* Right Column: Information Cards & Dispatch Details */}
          <AnimateIn variant="fade-left" delay={0.15} className="lg:col-span-5">
            <section className="space-y-8">
            
            {/* Presence Atelier Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E6693E]">Presence Atelier</span>
              <div className="space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Bhubaneswar Studio</h4>
                <p className="text-lg font-serif italic text-gray-600 leading-relaxed">
                  Plot No. 12, Janpath Road,<br />
                  Saheed Nagar, Bhubaneswar,<br />
                  Odisha 751007, India
                </p>
                <button className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-200 pb-1 hover:border-[#1D4E89] text-[#1D4E89] transition-all cursor-pointer">
                  Open Atlas <MapPin size={11} />
                </button>
              </div>
            </div>

            {/* Direct Digital Communication Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E6693E]">Direct Dispatch</span>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Electronic Mail</h4>
                  <a href="mailto:hello@penclub.com" className="text-lg font-serif font-black hover:italic text-[#1D4E89] transition-all flex items-center justify-between group">
                    hello@penclub.com <ArrowUpRight size={14} className="text-gray-300 group-hover:text-[#1D4E89] transition-colors" />
                  </a>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Direct Dial</h4>
                  <a href="tel:+442079460123" className="text-lg font-serif font-black hover:italic text-[#1D4E89] transition-all flex items-center justify-between group">
                    +44 20 7946 0123 <ArrowUpRight size={14} className="text-gray-300 group-hover:text-[#1D4E89] transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            {/* Social Grid channels */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md grid grid-cols-3 divide-x divide-gray-100">
              <a href="#" className="flex flex-col items-center justify-center gap-2 hover:text-[#E6693E] text-gray-400 transition-colors py-2 cursor-pointer">
                <Instagram size={18} />
                <span className="text-[8px] font-black uppercase tracking-widest">IG</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center gap-2 hover:text-[#E6693E] text-gray-400 transition-colors py-2 cursor-pointer">
                <Twitter size={18} />
                <span className="text-[8px] font-black uppercase tracking-widest">TW</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center gap-2 hover:text-[#E6693E] text-gray-400 transition-colors py-2 cursor-pointer">
                <Youtube size={18} />
                <span className="text-[8px] font-black uppercase tracking-widest">YT</span>
              </a>
            </div>

            {/* Local Time Tracker */}
            <div className="flex justify-between items-center px-4 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Clock size={12} /> Local: Open</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Studio Open</span>
              </div>
            </div>

          </section>
          </AnimateIn>

        </div>
      </main>

    </div>
  );
}

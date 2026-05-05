"use client";

import React from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Youtube, ArrowRight, ArrowUpRight } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-primary selection:bg-primary selection:text-white">
      {/* Decorative Background Text */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-0 flex items-center justify-center">
        <h1 className="text-[20vw] font-serif font-black leading-none uppercase tracking-tighter select-none">
          Converse
        </h1>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Main Grid: Broadsheet Style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-primary/20">
          
          {/* Section 1: The Identity (Vertical) */}
          <div className="lg:col-span-1 border-r border-primary/20 hidden lg:flex flex-col justify-between py-12 items-center">
            <span className="rotate-180 [writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[0.5em] text-primary/30">
              Pen Club Archive
            </span>
            <div className="w-px h-24 bg-primary/20"></div>
            <span className="[writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[0.5em] text-primary/30">
              Est. MMXXIII
            </span>
          </div>

          {/* Section 2: The Inquiry (Form) */}
          <div className="lg:col-span-7 p-8 md:p-16 border-r border-primary/20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Phase 01 — Inquiry</span>
                <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tighter leading-none">
                  Tell your <br /> <span className="italic font-normal">Narrative.</span>
                </h2>
              </div>

              <form className="space-y-10 pt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="relative group">
                    <input type="text" id="name" required className="peer w-full bg-transparent border-b border-primary/20 py-3 focus:outline-none focus:border-primary transition-all font-serif italic text-xl placeholder:text-transparent" placeholder="Name" />
                    <label htmlFor="name" className="absolute left-0 -top-4 text-[10px] font-black uppercase tracking-widest text-primary/40 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:italic peer-placeholder-shown:font-serif peer-placeholder-shown:text-primary/20 transition-all pointer-events-none">Full Name</label>
                  </div>
                  <div className="relative group">
                    <input type="email" id="email" required className="peer w-full bg-transparent border-b border-primary/20 py-3 focus:outline-none focus:border-primary transition-all font-serif italic text-xl placeholder:text-transparent" placeholder="Email" />
                    <label htmlFor="email" className="absolute left-0 -top-4 text-[10px] font-black uppercase tracking-widest text-primary/40 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:italic peer-placeholder-shown:font-serif peer-placeholder-shown:text-primary/20 transition-all pointer-events-none">Email Address</label>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Select Topic</p>
                  <div className="flex flex-wrap gap-3">
                    {["Collaborations", "Membership", "Press", "General"].map((topic) => (
                      <button key={topic} type="button" className="px-5 py-2 border border-primary/10 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <textarea id="message" rows={4} required className="peer w-full bg-transparent border-b border-primary/20 py-3 focus:outline-none focus:border-primary transition-all font-serif italic text-xl placeholder:text-transparent resize-none" placeholder="Message"></textarea>
                  <label htmlFor="message" className="absolute left-0 -top-4 text-[10px] font-black uppercase tracking-widest text-primary/40 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:italic peer-placeholder-shown:font-serif peer-placeholder-shown:text-primary/20 transition-all pointer-events-none">Your Message</label>
                </div>

                <button className="w-full md:w-auto bg-primary text-white px-16 py-6 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-secondary transition-all flex items-center justify-center gap-4 group">
                  Transmit <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>

          {/* Section 3: The Dispatch (Details) */}
          <div className="lg:col-span-4 flex flex-col divide-y divide-primary/20">
            {/* Top: Digital */}
            <div className="p-8 md:p-12 space-y-8 flex-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Phase 02 — Dispatch</span>
              <div className="space-y-12 pt-4">
                <div className="space-y-4">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-primary/30">Electronic Mail</h4>
                  <a href="mailto:hello@penclub.com" className="text-2xl font-serif font-black hover:italic transition-all flex items-center justify-between group">
                    hello@penclub.com <ArrowUpRight size={20} className="text-primary/20 group-hover:text-primary transition-colors" />
                  </a>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-primary/30">Direct Dial</h4>
                  <a href="tel:+442079460123" className="text-2xl font-serif font-black hover:italic transition-all flex items-center justify-between group">
                    +44 20 7946 0123 <ArrowUpRight size={20} className="text-primary/20 group-hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            {/* Middle: Physical */}
            <div className="p-8 md:p-12 space-y-8 flex-1 bg-primary/[0.02]">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Phase 03 — Presence</span>
              <div className="space-y-6 pt-4">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-primary/30">Bhubaneswar Atelier</h4>
                <p className="text-xl font-serif italic text-primary/60 leading-tight">
                  Plot No. 12, Janpath Road,<br />
                  Saheed Nagar, Bhubaneswar,<br />
                  Odisha 751007, India
                </p>
                <button className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border-b border-primary/20 pb-1 hover:border-primary transition-all">
                  Open Atlas <MapPin size={12} />
                </button>
              </div>
            </div>

            {/* Bottom: Social */}
            <div className="p-8 md:p-12 grid grid-cols-3 divide-x divide-primary/20">
              <a href="#" className="flex flex-col items-center justify-center gap-3 hover:text-secondary transition-colors py-4">
                <Instagram size={20} strokeWidth={1.5} />
                <span className="text-[8px] font-black uppercase tracking-widest">IG</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center gap-3 hover:text-secondary transition-colors py-4">
                <Twitter size={20} strokeWidth={1.5} />
                <span className="text-[8px] font-black uppercase tracking-widest">TW</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center gap-3 hover:text-secondary transition-colors py-4">
                <Youtube size={20} strokeWidth={1.5} />
                <span className="text-[8px] font-black uppercase tracking-widest">YT</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8 px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
            Current Local Time: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
          </p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Our studio is currently open</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

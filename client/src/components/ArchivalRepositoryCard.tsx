"use client";

import React from "react";
import { ArrowRight, LucideIcon, Ticket } from "lucide-react";
import AnimateIn from "@/src/components/ui/AnimateIn";

interface ArchivalRepositoryCardProps {
  label?: string;
  mainTitle?: React.ReactNode;
  italicTitle?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  badgeIcon?: LucideIcon;
  badgeLabel?: string;
  indexNo?: string;
  className?: string;
  type?: 'editorial' | 'audio';
  showNewsletterForm?: boolean;
}

const ArchivalRepositoryCard: React.FC<ArchivalRepositoryCardProps> = ({
  label = "Archival Repository",
  mainTitle = "Deepen your",
  italicTitle = "understanding",
  description = "Unlock exclusive access to previous transcripts, transcript recordings, and photo logs.",
  buttonText = "Explore Archives",
  onButtonClick,
  badgeIcon: BadgeIcon = Ticket,
  badgeLabel = "Archival Index",
  indexNo = "INDEX NO. 404",
  className = "",
  type = 'editorial',
  showNewsletterForm = false,
}) => {
  return (
    <AnimateIn variant="fade-up" delay={0.05} className={className}>
      <section className="max-w-6xl mx-auto px-8 mt-16 relative z-10">
        <div className="bg-gradient-to-br from-[#1D4E89] via-[#123861] to-[#0A1E36] text-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden relative border border-white/10">
          
          {/* Cinematic lighting ambient glow effect */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E6693E]/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Left Part: Premium Asymmetrical Editorial Section */}
          <div className="col-span-12 md:col-span-7 p-7 md:p-10 space-y-5 relative z-10 flex flex-col justify-center">

            {/* Minimal orange outline archive icon & Uppercase Label */}
            <div className="flex items-center gap-3 select-none">
              <svg className="w-6 h-6 text-[#E6693E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="10" width="18" height="11" rx="2" />
                <path d="M10 14h4" strokeWidth="2" />
                <path d="M6 10V6a1 1 0 0 1 1-1h3l1 2h6a1 1 0 0 1 1 1v2" />
              </svg>
              <div className="h-4 w-[1px] bg-[#E6693E]/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E6693E] font-sans">{label}</span>
            </div>

            {/* Massive elegant serif heading with italic styling */}
            <h2 className="text-3xl md:text-[42px] font-serif font-bold leading-[1.08] tracking-tight text-white">
              {mainTitle} <br className="hidden md:block" />
              <span className="italic font-normal text-white/95">{italicTitle}</span><span className="text-[#E6693E]">.</span>
            </h2>

            {/* Short Orange Accent Divider */}
            <div className="w-16 h-[2px] bg-[#E6693E]" />

            {/* Supporting Paragraph Text */}
            <p className="text-sm font-sans text-white/70 max-w-sm leading-relaxed">
              {description}
            </p>

            {/* Action Area: Either a CTA button or a Newsletter Form */}
            <div className="pt-2">
              {showNewsletterForm ? (
                <form className="w-full flex flex-col sm:flex-row gap-3 relative z-10 shrink-0 max-w-md">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white font-serif italic placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all text-xs w-full sm:w-64"
                  />
                  <button className="bg-[#E6693E] hover:bg-opacity-90 rounded-xl px-6 py-3.5 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-[#E6693E]/20">
                    Subscribe
                  </button>
                </form>
              ) : (
                <button
                  onClick={onButtonClick}
                  className="bg-[#E6693E] hover:bg-[#d65d35] text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-all duration-300 cursor-pointer shadow-lg shadow-[#E6693E]/20 hover:shadow-[#E6693E]/45 hover:scale-[1.02] active:scale-[0.98] w-fit"
                >
                  <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="10" width="18" height="11" rx="2" />
                    <path d="M10 14h4" />
                    <path d="M6 10V6a1 1 0 0 1 1-1h3l1 2h6a1 1 0 0 1 1 1v2" />
                  </svg>
                  <span>{buttonText}</span>
                  <ArrowRight size={14} className="stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* Large Illustrations — right side of left panel */}
            {type === 'editorial' ? (
              <svg
                className="absolute top-1/2 -translate-y-1/2 right-0 w-64 h-80 text-white/30 pointer-events-none hidden md:block select-none"
                viewBox="0 0 120 200"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="30" y="148" width="60" height="36" rx="6" strokeWidth="1.5" />
                <path d="M48 148 L48 140 L72 140 L72 148" strokeWidth="1.5" />
                <rect x="44" y="134" width="32" height="8" rx="3" strokeWidth="1.2" />
                <path d="M33 166 Q60 162 87 166" strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.6" />
                <path d="M36 155 Q42 153 50 155" strokeWidth="0.6" opacity="0.4" />
                <path d="M60 138 C58 115 54 90 50 68 C46 48 40 30 34 12" strokeWidth="1.6" />
                <path d="M59 132 C68 126 74 118 72 110" strokeWidth="1" />
                <path d="M57 124 C67 116 75 107 73 98" strokeWidth="1" />
                <path d="M55 116 C65 107 73 97 71 87" strokeWidth="1" />
                <path d="M53 108 C62 99 70 88 68 78" strokeWidth="1" />
                <path d="M51 99 C60 91 67 80 65 70" strokeWidth="0.9" />
                <path d="M49 90 C58 82 64 71 62 62" strokeWidth="0.9" />
                <path d="M47 81 C55 73 60 62 58 53" strokeWidth="0.8" />
                <path d="M45 72 C52 64 56 54 54 46" strokeWidth="0.8" />
                <path d="M43 62 C49 55 52 46 50 38" strokeWidth="0.7" />
                <path d="M41 52 C46 46 48 38 46 30" strokeWidth="0.7" />
                <path d="M39 42 C43 37 44 30 42 23" strokeWidth="0.6" />
                <path d="M37 32 C40 27 41 21 39 15" strokeWidth="0.6" />
                <path d="M59 132 C50 127 43 118 44 109" strokeWidth="1" />
                <path d="M57 124 C47 118 40 108 42 99" strokeWidth="1" />
                <path d="M55 116 C44 110 37 99 39 89" strokeWidth="1" />
                <path d="M53 108 C43 101 36 91 38 81" strokeWidth="0.9" />
                <path d="M51 99 C42 92 36 82 38 72" strokeWidth="0.9" />
                <path d="M49 90 C40 84 34 74 37 64" strokeWidth="0.8" />
                <path d="M47 81 C39 75 33 65 36 56" strokeWidth="0.8" />
                <path d="M45 72 C38 66 33 57 36 48" strokeWidth="0.7" />
                <path d="M43 62 C37 57 32 49 35 41" strokeWidth="0.7" />
                <path d="M41 52 C36 47 32 40 35 33" strokeWidth="0.6" />
                <path d="M39 42 C35 38 31 32 34 26" strokeWidth="0.6" />
                <path d="M37 32 C34 29 30 24 33 19" strokeWidth="0.5" />
                <path d="M34 12 C31 6 29 2 34 0 C38 2 36 8 34 12" strokeWidth="1" />
                <path d="M60 138 C60 141 59 144 60 147" strokeWidth="1.2" />
                <ellipse cx="60" cy="148" rx="2" ry="1.5" strokeWidth="0.8" opacity="0.5" />
                <line x1="24" y1="184" x2="96" y2="184" strokeDasharray="3 2" opacity="0.2" strokeWidth="0.7" />
              </svg>
            ) : (
              /* Audio Variant Illustration: Vintage Microphone */
              <svg
                className="absolute top-1/2 -translate-y-1/2 right-4 w-56 h-72 text-white/25 pointer-events-none hidden md:block select-none"
                viewBox="0 0 100 160"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Stand Base */}
                <path d="M30 150 L70 150 M50 150 L50 120" strokeWidth="1.5" />
                {/* Stand Neck */}
                <path d="M45 120 L55 120 L50 110 Z" fill="currentColor" opacity="0.4" />
                {/* Microphone Body (Oval Cage) */}
                <rect x="35" y="20" width="30" height="65" rx="15" strokeWidth="2" />
                {/* Horizontal Grill Lines */}
                <line x1="35" y1="35" x2="65" y2="35" strokeWidth="1" opacity="0.6" />
                <line x1="35" y1="45" x2="65" y2="45" strokeWidth="1" opacity="0.6" />
                <line x1="35" y1="55" x2="65" y2="55" strokeWidth="1" opacity="0.6" />
                <line x1="35" y1="65" x2="65" y2="65" strokeWidth="1" opacity="0.6" />
                <line x1="35" y1="75" x2="65" y2="75" strokeWidth="1" opacity="0.6" />
                {/* Vertical Center Line */}
                <line x1="50" y1="20" x2="50" y2="85" strokeWidth="1" opacity="0.6" />
                {/* Shock Mount / Holder */}
                <path d="M25 50 Q25 100 50 100 Q75 100 75 50" strokeWidth="1.5" />
                {/* Connector */}
                <path d="M45 100 L55 100 L50 110 Z" strokeWidth="1" />
                {/* Sound Waves / Sparkles */}
                <path d="M80 30 Q90 50 80 70" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                <path d="M20 30 Q10 50 20 70" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              </svg>
            )}
          </div>

          {/* Right Part: Asymmetrical 40% Width Cream Column (Parchment & Blueprint Texture) */}
          <div className="col-span-12 md:col-span-5 relative min-h-[280px] md:min-h-full overflow-hidden flex flex-col items-center justify-center p-7">

            {/* Cream panel clipped so the parent blue background shows through the slant */}
            <div className="absolute inset-0 bg-[#FAF7F2] z-0 md:[clip-path:polygon(55px_0,100%_0,100%_100%,0_100%)]" />

            {/* Slanted Accent Separation Line */}
            <div className="absolute inset-y-0 left-[27px] w-[2.5px] bg-[#E6693E] rotate-[8deg] origin-top hidden md:block z-20" />

            {/* Fine Blueprint Grid & Repeating Diamonds parchment pattern */}
            <div className="absolute inset-0 opacity-40 pointer-events-none z-[1] md:[clip-path:polygon(55px_0,100%_0,100%_100%,0_100%)]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="luxurious-blueprint" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 0 0 L 32 0 M 0 0 L 0 32" fill="none" stroke="#1D4E89" strokeWidth="0.5" strokeOpacity="0.04" />
                    <path d="M 16 0 L 32 16 L 16 32 L 0 16 Z" fill="none" stroke="#1D4E89" strokeWidth="0.5" strokeOpacity="0.06" />
                    <circle cx="16" cy="16" r="1.5" fill="#1D4E89" fillOpacity="0.08" />
                    <circle cx="0" cy="0" r="1.2" fill="#E6693E" fillOpacity="0.12" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#luxurious-blueprint)" />
              </svg>
            </div>

            <div className="absolute top-1/2 right-8 text-[#1D4E89]/5 text-xs hidden md:block select-none pointer-events-none font-serif z-[2]">{indexNo}</div>

            {/* Centerpiece: Floating circular archival badge */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">

              <div className="relative group">
                {/* Subtle soft orange floating glow around badge */}
                <div className="absolute inset-0 rounded-full bg-[#E6693E]/25 blur-xl group-hover:bg-[#E6693E]/35 transition-all duration-700 scale-125 pointer-events-none" />


                {/* Glossy White Circle Card with soft layered shadow */}
                <div className="w-24 h-24 rounded-full bg-white/95 flex items-center justify-center text-[#E6693E] shadow-2xl border border-white/60 backdrop-blur-md">
                  <BadgeIcon size={34} className="stroke-[1.5] drop-shadow-sm" />
                </div>
              </div>

              {/* Sophisticated Editorial Typography composition */}
              <div className="flex flex-col items-center space-y-1 select-none">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1D4E89]/40 font-sans">Pen Club</span>

                <h3 className="text-[13px] font-serif font-bold uppercase tracking-[0.2em] text-[#1D4E89] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6693E]" />
                  {badgeLabel}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6693E]" />
                </h3>

                <div className="w-10 h-[1.5px] bg-[#E6693E] mt-2.5" />
              </div>
            </div>

            {/* Bottom Illustrations integrated into the right panel */}
            {type === 'editorial' ? (
              <svg className="absolute bottom-0 right-0 w-[92%] h-32 text-[#1D4E89]/25 pointer-events-none hidden md:block z-[2]" viewBox="0 0 420 120" preserveAspectRatio="xMidYMax meet">
                <line x1="12" y1="104" x2="408" y2="104" stroke="currentColor" strokeWidth="1" />

                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="42" y="82" width="58" height="12" rx="1" strokeWidth="0.8" />
                  <rect x="48" y="69" width="48" height="12" rx="1" strokeWidth="0.8" />
                  <rect x="54" y="58" width="38" height="11" rx="1" strokeWidth="0.8" />

                  <rect x="136" y="34" width="14" height="70" rx="1" strokeWidth="0.9" />
                  <rect x="154" y="26" width="18" height="78" rx="1" strokeWidth="0.9" />
                  <rect x="176" y="42" width="13" height="62" rx="1" strokeWidth="0.9" />
                  <path d="M161 38h6M161 92h6M182 52h2M182 88h2" strokeWidth="0.8" />

                  <g transform="rotate(-9 216 104)">
                    <rect x="207" y="35" width="18" height="69" rx="1" strokeWidth="0.9" />
                    <path d="M211 48h10M211 89h10" strokeWidth="0.8" />
                  </g>

                  <rect x="248" y="32" width="16" height="72" rx="1" strokeWidth="0.9" />
                  <rect x="268" y="24" width="20" height="80" rx="1" strokeWidth="0.9" />
                  <rect x="292" y="48" width="14" height="56" rx="1" strokeWidth="0.9" />
                  <path d="M276 38c4-4 8-4 8 2v52M256 45v44M299 58v34" strokeWidth="0.8" />

                  <rect x="336" y="86" width="54" height="10" rx="1" strokeWidth="0.8" />
                  <rect x="342" y="75" width="44" height="10" rx="1" strokeWidth="0.8" />
                  <rect x="348" y="65" width="34" height="10" rx="1" strokeWidth="0.8" />
                </g>
              </svg>
            ) : (
              /* Audio Variant Illustration: Stacked Vinyls & Records */
              <svg className="absolute bottom-0 right-0 w-[80%] h-32 text-[#1D4E89]/20 pointer-events-none hidden md:block z-[2]" viewBox="0 0 300 100" preserveAspectRatio="xMidYMax meet">
                <line x1="0" y1="90" x2="300" y2="90" stroke="currentColor" strokeWidth="1" />
                
                <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  {/* Vinyl Record leaning 1 */}
                  <g transform="rotate(-15 60 90)">
                    <circle cx="60" cy="50" r="35" strokeWidth="1.5" />
                    <circle cx="60" cy="50" r="10" opacity="0.5" />
                    <circle cx="60" cy="50" r="1.5" fill="currentColor" />
                    <path d="M60 25 A25 25 0 0 1 85 50" opacity="0.3" />
                  </g>
                  
                  {/* Vinyl Record leaning 2 */}
                  <g transform="rotate(-5 110 90)">
                    <circle cx="110" cy="45" r="40" strokeWidth="1.5" />
                    <circle cx="110" cy="45" r="12" opacity="0.5" />
                    <circle cx="110" cy="45" r="1.5" fill="currentColor" />
                    <path d="M110 15 A30 30 0 0 1 140 45" opacity="0.3" />
                  </g>

                  {/* Vertical Vinyl Sleeves */}
                  <rect x="160" y="20" width="4" height="70" rx="1" strokeWidth="0.8" />
                  <rect x="168" y="15" width="5" height="75" rx="1" strokeWidth="0.8" />
                  <rect x="178" y="25" width="4" height="65" rx="1" strokeWidth="0.8" />
                  <rect x="187" y="10" width="6" height="80" rx="1" strokeWidth="0.8" />
                  
                  {/* Cassette Tape */}
                  <rect x="210" y="60" width="45" height="30" rx="2" strokeWidth="1.2" />
                  <circle cx="222" cy="75" r="5" strokeWidth="0.8" />
                  <circle cx="243" cy="75" r="5" strokeWidth="0.8" />
                  <line x1="222" y1="75" x2="243" y2="75" strokeWidth="0.5" strokeDasharray="1 1" />
                  
                  {/* Another leaning record at the end */}
                  <g transform="rotate(10 270 90)">
                    <circle cx="270" cy="55" r="30" strokeWidth="1.5" />
                    <circle cx="270" cy="55" r="8" opacity="0.5" />
                  </g>
                </g>
              </svg>
            )}
          </div>
        </div>
      </section>
    </AnimateIn>
  );
};

export default ArchivalRepositoryCard;

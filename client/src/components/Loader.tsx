"use client";

import { motion } from "motion/react";
import { logo } from "@/public/images";
import Image from "next/image";

interface LoaderProps {
  fullScreen?: boolean;
  progress?: number;
}

export default function Loader({ fullScreen = false, progress = 0 }: LoaderProps) {
  if (!fullScreen) {
    // ... inline loader stays same or could use progress too ...
    return (
      <div className="flex items-center justify-center p-12">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border border-primary/10 flex items-center justify-center bg-white p-2">
            <Image src={logo} alt="Pen Club" className="w-full h-auto opacity-20" />
          </div>
          <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary/30">
            Fetching Archive
          </span>
        </motion.div>
      </div>
    );
  }

  const roundedProgress = Math.min(Math.round(progress), 100);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Typographic Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center justify-center">
        <span className="text-[40vw] font-serif font-black whitespace-nowrap leading-none transform -rotate-12">
          ATELIER
        </span>
      </div>

      {/* Center Content */}
      <div className="relative flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm p-4">
            <Image src={logo} alt="Pen Club" className="w-full h-auto invert brightness-0" />
          </div>
          
          <div className="text-center space-y-4">
            <h2 className="text-white text-4xl md:text-5xl font-serif font-black tracking-tighter">
              Pen Club<span className="text-white/20 italic font-normal">.</span>
            </h2>
            
            {/* Percentage Counter */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-white text-lg font-brand font-bold tabular-nums">
                {roundedProgress}%
              </span>
              <div className="h-px w-48 bg-white/10 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${roundedProgress}%` }}
                  transition={{ duration: 0.1 }}
                  className="absolute top-0 bottom-0 left-0 bg-white/40"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-white/40"
        >
          {roundedProgress === 100 ? "Ready for Entry" : "Initializing Digital Atelier"}
        </motion.span>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-12 left-12 w-12 h-12 border-t border-l border-white/10" />
      <div className="absolute top-12 right-12 w-12 h-12 border-t border-r border-white/10" />
      <div className="absolute bottom-12 left-12 w-12 h-12 border-b border-l border-white/10" />
      <div className="absolute bottom-12 right-12 w-12 h-12 border-b border-r border-white/10" />
    </motion.div>
  );
}

"use client";

import { motion } from "motion/react";

export function SkeletonCard() {
  return (
    <div className="border border-primary/5 bg-white flex flex-col h-full animate-pulse">
      {/* Shimmer Image Area */}
      <div className="relative aspect-[16/10] bg-primary/[0.03] border-b border-primary/5 overflow-hidden">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      </div>

      {/* Shimmer Content Area */}
      <div className="p-5 flex-1 flex flex-col space-y-4">
        <div className="flex gap-4">
          <div className="h-2 w-16 bg-primary/[0.05]" />
          <div className="h-2 w-12 bg-primary/[0.05]" />
        </div>
        
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-primary/[0.08]" />
          <div className="h-4 w-1/2 bg-primary/[0.08]" />
        </div>

        <div className="h-12 w-full bg-primary/[0.02] mt-auto" />

        <div className="pt-4 border-t border-primary/5 flex justify-between items-center">
          <div className="h-2 w-20 bg-primary/[0.05]" />
          <div className="h-3 w-3 rounded-full bg-primary/[0.05]" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

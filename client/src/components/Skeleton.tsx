"use client";

import { motion } from "motion/react";

// Standard Shimmering Skeleton Card
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

// Standard Skeleton Grid Wrapper
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Shimmering Stat Card Skeleton
export function StatCardSkeleton() {
  return (
    <div className="bg-[#FAF9F5] border border-primary/10 p-6 rounded-none animate-pulse relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="h-4 w-24 bg-primary/10 rounded-none" />
        <div className="h-8 w-8 bg-primary/10 rounded-none" />
      </div>
      <div className="h-8 w-32 bg-primary/10 rounded-none mb-3" />
      <div className="h-3.5 w-20 bg-primary/10 rounded-none" />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/5" />
    </div>
  );
}

// Shimmering Chart Skeleton
export function ChartSkeleton({ title }: { title?: string }) {
  return (
    <div className="bg-[#FAF9F5] border border-primary/10 p-6 rounded-none animate-pulse h-[352px] flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="h-5 w-32 bg-primary/10 rounded-none mb-2" />
        <div className="h-3.5 w-48 bg-primary/10 rounded-none" />
      </div>
      <div className="flex items-end justify-between gap-4 h-44 pt-4">
        {[40, 60, 30, 80, 50, 70, 45].map((h, i) => (
          <div key={i} className="flex-1 bg-primary/[0.06] rounded-none" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="flex justify-between mt-4 border-t border-primary/5 pt-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-3 w-8 bg-primary/10 rounded-none" />
        ))}
      </div>
    </div>
  );
}

// Shimmering List Skeleton
export function ListSkeleton({ title }: { title?: string }) {
  return (
    <div className="bg-[#FAF9F5] border border-primary/10 p-6 rounded-none animate-pulse h-80 flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="h-5 w-32 bg-primary/10 rounded-none mb-2" />
        <div className="h-3.5 w-48 bg-primary/10 rounded-none mb-6" />
      </div>
      <div className="space-y-4 flex-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-8 w-8 bg-[#FAF9F5] border border-primary/10 rounded-none flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-3/4 bg-primary/10 rounded-none" />
              <div className="h-2.5 w-1/2 bg-primary/10 rounded-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Shimmering Article Card Skeleton
export function ArticleCardSkeleton() {
  return (
    <div className="bg-card border border-primary/15 rounded-none overflow-hidden animate-pulse flex flex-col h-[400px] justify-between relative">
      <div className="h-48 bg-primary/5 w-full flex items-center justify-center border-b border-primary/10">
        <div className="w-12 h-12 bg-primary/10 rounded-none" />
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="h-5 w-3/4 bg-primary/10 rounded-none mb-3" />
          <div className="space-y-1.5 mt-2">
            <div className="h-3 w-full bg-primary/5 rounded-none" />
            <div className="h-3 w-5/6 bg-primary/5 rounded-none" />
          </div>
          <div className="flex gap-1.5 mt-4">
            <div className="h-5 w-12 bg-primary/5 rounded-none" />
            <div className="h-5 w-16 bg-primary/5 rounded-none" />
          </div>
        </div>
        <div className="flex items-center gap-4 border-t border-primary/5 pt-4 mt-6">
          <div className="h-3.5 w-16 bg-primary/10 rounded-none" />
          <div className="h-3.5 w-20 bg-primary/10 rounded-none" />
          <div className="h-3.5 w-8 bg-primary/10 rounded-none" />
        </div>
      </div>
      <div className="px-6 pb-6 pt-0 mt-auto">
        <div className="grid grid-cols-3 gap-2.5">
          <div className="h-9 bg-primary/10 rounded-none" />
          <div className="h-9 bg-primary/10 rounded-none" />
          <div className="h-9 bg-primary/10 rounded-none" />
        </div>
      </div>
    </div>
  );
}

// Shimmering Book Card Skeleton
export function BookCardSkeleton() {
  return (
    <div className="bg-card border border-primary/15 rounded-none overflow-hidden animate-pulse flex flex-col justify-between h-[280px]">
      <div>
        {/* Book Cover Section Placeholder */}
        <div className="flex gap-4 p-4 pb-2">
          <div className="w-24 h-32 bg-primary/10 rounded-none flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-3/4 bg-primary/10 rounded-none" />
            <div className="h-3.5 w-1/2 bg-primary/5 rounded-none" />
            <div className="flex flex-wrap gap-1.5 mt-3">
              <div className="h-5 w-16 bg-primary/5 rounded-none" />
              <div className="h-5 w-20 bg-primary/5 rounded-none" />
            </div>
            <div className="h-3.5 w-12 bg-primary/10 rounded-none mt-3.5" />
          </div>
        </div>

        {/* Genre and Date Placeholder */}
        <div className="px-4 pb-2 mt-2">
          <div className="flex items-center justify-between border-t border-primary/5 pt-2">
            <div className="h-3 w-20 bg-primary/5 rounded-none" />
            <div className="h-3 w-24 bg-primary/5 rounded-none" />
          </div>
        </div>
      </div>

      {/* Action Buttons Placeholder */}
      <div className="p-4 pt-0 mt-4">
        <div className="grid grid-cols-3 gap-2.5">
          <div className="h-9 bg-primary/10 rounded-none" />
          <div className="h-9 bg-primary/10 rounded-none" />
          <div className="h-9 bg-primary/10 rounded-none" />
        </div>
      </div>
    </div>
  );
}

// Shimmering Publisher Card Skeleton
export function PublisherCardSkeleton() {
  return (
    <div className="bg-card border border-primary/15 rounded-none p-6 animate-pulse flex flex-col justify-between h-[185px]">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-none flex-shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4.5 w-3/4 bg-primary/10 rounded-none" />
          <div className="h-3 w-1/3 bg-primary/5 rounded-none" />
          <div className="h-3.5 w-4/5 bg-primary/5 rounded-none mt-2" />
          <div className="h-3 w-1/2 bg-primary/5 rounded-none" />
        </div>
      </div>

      <div className="flex gap-2.5 mt-6 pt-4 border-t border-primary/10 justify-end">
        <div className="w-9 h-9 bg-primary/10 rounded-none" />
        <div className="w-9 h-9 bg-primary/10 rounded-none" />
        <div className="w-9 h-9 bg-primary/10 rounded-none" />
      </div>
    </div>
  );
}

// Shimmering User Card Skeleton
export function UserCardSkeleton() {
  return (
    <div className="bg-card border border-primary/15 rounded-none p-6 animate-pulse flex flex-col justify-between h-[210px]">
      <div className="flex items-start gap-4">
        {/* Avatar Placeholder */}
        <div className="w-14 h-14 bg-primary/10 rounded-none flex-shrink-0" />
        
        {/* User Details Placeholder */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4.5 w-24 bg-primary/10 rounded-none" />
            <div className="h-4 w-12 bg-primary/5 rounded-none" />
          </div>
          <div className="h-3 w-1/3 bg-primary/5 rounded-none" />
          <div className="h-3 w-1/4 bg-primary/5 rounded-none mt-1" />
          <div className="space-y-1 mt-3">
            <div className="h-3 w-full bg-primary/5 rounded-none" />
            <div className="h-3 w-5/6 bg-primary/5 rounded-none" />
          </div>
        </div>
      </div>

      {/* Action Buttons Placeholder */}
      <div className="flex gap-2.5 mt-6 pt-4 border-t border-primary/10 justify-end">
        <div className="w-9 h-9 bg-primary/10 rounded-none" />
        <div className="w-9 h-9 bg-primary/10 rounded-none" />
        <div className="w-9 h-9 bg-primary/10 rounded-none" />
      </div>
    </div>
  );
}

// Shimmering Settings Page Skeleton
export function SettingsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-6 w-48 bg-primary/10 rounded-none" />
        <div className="h-3.5 w-64 bg-primary/5 rounded-none mt-2" />
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-3 w-20 bg-primary/5 rounded-none mb-2.5" />
            <div className="h-11 bg-primary/10 rounded-none w-full" />
          </div>
          <div>
            <div className="h-3 w-20 bg-primary/5 rounded-none mb-2.5" />
            <div className="h-11 bg-primary/10 rounded-none w-full" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-3 w-28 bg-primary/5 rounded-none mb-2.5" />
            <div className="h-11 bg-primary/10 rounded-none w-full" />
          </div>
          <div>
            <div className="h-3 w-24 bg-primary/5 rounded-none mb-2.5" />
            <div className="h-11 bg-primary/10 rounded-none w-full" />
          </div>
        </div>

        <div>
          <div className="h-3 w-16 bg-primary/5 rounded-none mb-2.5" />
          <div className="h-24 bg-primary/10 rounded-none w-full" />
        </div>
      </div>
      
      <div className="h-11 w-32 bg-primary/10 rounded-none mt-6" />
    </div>
  );
}

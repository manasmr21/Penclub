"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FilterDropdownProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  loading?: boolean;
  label?: string;
  placeholder?: string;
}

export default function FilterDropdown({
  options,
  selected,
  onChange,
  loading = false,
  label = "Filter By",
  placeholder = "Select option",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    if (loading) return;
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full sm:w-64 z-30 font-sans">
      <div className="flex flex-col gap-1.5">
        {label && (
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1D4E89]/60 pl-1">
            {label}
          </span>
        )}
        <button
          type="button"
          onClick={() => !loading && setIsOpen(!isOpen)}
          disabled={loading}
          className={`flex items-center justify-between w-full px-5 py-3 bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#1D4E89]/40 hover:bg-gray-50/50 transition-all duration-300 text-left rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1D4E89]/20 focus:border-[#1D4E89] ${
            loading ? "opacity-50 cursor-not-allowed animate-pulse" : ""
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Filter size={14} className="text-gray-400" />
            <span>{selected === "All" ? "All Categories" : selected || placeholder}</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#1D4E89]" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 shadow-[0_12px_40px_rgba(13,56,125,0.08)] overflow-hidden rounded-2xl z-50 py-1.5 max-h-64 overflow-y-auto scrollbar-hide backdrop-blur-md bg-white/95"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-5 py-2.5 text-sm transition-all duration-150 cursor-pointer flex items-center justify-between ${
                  selected === option
                    ? "bg-[#1D4E89] text-white font-bold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{option === "All" ? "All Categories" : option}</span>
                {selected === option && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

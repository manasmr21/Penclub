"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Clock, Calendar, Tag } from "lucide-react";
import { fetchAllArticles, type PublicArticle } from "@/src/lib/articles-api";
import Link from "next/link";
import Image from "next/image";
import FilterDropdown from "@/src/components/FilterDropdown";
import { article1, article2, article3, article4, article5 } from "@/public/images";

const fallbackImages = [article1, article2, article3, article4, article5];
function getFallbackArticleImage(index: number) {
  return fallbackImages[index % fallbackImages.length];
}

function truncate(text: string, max = 120) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

// Golden/Tan Floral Icon Flanking the Ornate Title
const FlowerSVG = () => (
  <svg className="w-8 h-8 text-[#E8D5B7]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2L14.5,9H22L16,13.5L18.5,21L12,16.5L5.5,21L8,13.5L2,9H9.5L12,2Z" />
  </svg>
);

// Pastel background containers for article covers
function getPastelBg(index: number) {
  const bgs = ["bg-blue-50", "bg-purple-50", "bg-cyan-50", "bg-yellow-50", "bg-red-50"];
  return bgs[index % bgs.length];
}

// Custom badges matching books bookshelf specifications
function getBadgeColor(tag: string) {
  const t = (tag || "").toLowerCase();
  if (t.includes("design") || t.includes("art")) return "bg-[#E6693E]";
  if (t.includes("tech") || t.includes("code")) return "bg-[#008080]";
  if (t.includes("poetry") || t.includes("lit")) return "bg-purple-600";
  if (t.includes("opinion") || t.includes("essay")) return "bg-indigo-600";
  if (t.includes("guide") || t.includes("tutorial")) return "bg-yellow-600";
  return "bg-[#1D4E89]";
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<PublicArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<PublicArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const articlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAllArticles = async () => {
      setLoading(true);
      try {
        const all: PublicArticle[] = [];
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await fetchAllArticles(page, 10);
          all.push(...response.articles);
          hasNextPage = response.pagination?.hasNextPage ?? false;
          page += 1;
        }

        setArticles(all);
        setFilteredArticles(all);
      } catch {
        setArticles([]);
        setFilteredArticles([]);
      } finally {
        setLoading(false);
      }
    };

    void loadAllArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        (article.content || "").toLowerCase().includes(appliedSearch.toLowerCase());
      const matchesTag = selectedTag === "All" || (article.tags || []).includes(selectedTag);
      return matchesSearch && matchesTag;
    });
    setFilteredArticles(filtered);
  }, [appliedSearch, selectedTag, articles]);

  const allTags = useMemo(() => {
    if (loading) {
      return ["All", "Design", "Writing", "Atelier", "Literature", "Guides", "Essays"];
    }
    const tagsSet = new Set(articles.flatMap(a => a.tags || []));
    return ["All", ...Array.from(tagsSet)];
  }, [articles, loading]);

  if (!articles.length && !loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-[#FDF9F0]">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <div className="w-24 h-24 rounded-none flex items-center justify-center mx-auto border border-primary/5">
            <Tag size={40} className="text-primary/10" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-serif font-black text-primary tracking-tight">The archives are quiet</h2>
            <p className="text-primary/40 font-serif italic text-lg">Check back soon for new literary transmissions and articles.</p>
          </div>
          <Link href="/" className="inline-block px-10 py-4 bg-primary text-white font-sans font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF9F0] text-[#1A1A1A]">

      {/* BEGIN: HeroSection */}
      <section className="relative overflow-hidden bg-[#FDF9F0] pt-10 md:pt-20 pb-16 md:pb-28 px-4 md:px-8">

        {/* Abstract shape exactly matching bookshelf */}
        <div className="absolute bottom-[-20%] md:bottom-[-10%] left-[-10%] w-[120%] h-[60%] bg-[#1D4E89] rounded-t-[50%] z-0 -rotate-2 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">

          {/* Local line art article illustration on the bottom left (asymmetric scatter) */}
          <motion.div
            initial={{ opacity: 0, y: 28, rotate: -12, scale: 0.92 }}
            animate={{ opacity: 0.8, y: 0, rotate: -6, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="absolute -left-10 -bottom-8 w-48 pointer-events-none hidden md:block"
          >
            <Image
              src={article1}
              alt="Line Art Cover 1"
              className="mix-blend-multiply object-contain"
            />
          </motion.div>

          {/* Local line art article illustration on the top left (asymmetric scatter) */}
          <motion.div
            initial={{ opacity: 0, y: -24, rotate: 12, scale: 0.92 }}
            animate={{ opacity: 0.85, y: 0, rotate: 6, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.25 }}
            className="absolute left-[15%] -top-12 w-40 pointer-events-none hidden lg:block"
          >
            <Image
              src={article2}
              alt="Line Art Cover 2"
              className="mix-blend-multiply object-contain"
            />
          </motion.div>

          {/* Local line art article illustration on the top right (asymmetric scatter) */}
          <motion.div
            initial={{ opacity: 0, y: -22, rotate: -9, scale: 0.92 }}
            animate={{ opacity: 0.8, y: 0, rotate: -3, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
            className="absolute right-[12%] -top-6 w-36 pointer-events-none hidden lg:block"
          >
            <Image
              src={article5}
              alt="Line Art Cover 3"
              className="mix-blend-multiply object-contain"
            />
          </motion.div>

          {/* Local line art article illustration on the bottom right (asymmetric scatter) */}
          <motion.div
            initial={{ opacity: 0, y: 26, rotate: 9, scale: 0.92 }}
            animate={{ opacity: 0.85, y: 0, rotate: 3, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.45 }}
            className="absolute -right-8 bottom-2 w-48 pointer-events-none hidden md:block"
          >
            <Image
              src={article4}
              alt="Line Art Cover 5"
              className="mix-blend-multiply object-contain"
            />
          </motion.div>



          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="text-3xl md:text-6xl font-bold text-secondary max-w-3xl leading-tight font-sans"
          >
            Read narratives <br /> that shape <span className="font-serif italic text-[#1D4E89] font-normal">the culture</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.32 }}
            className="mt-6 text-lg text-black md:text-white font-bold font-sans"
          >
            Articles, editorials, and commentary from the Digital Atelier.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.44 }}
            onClick={() => articlesRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-8 bg-[#E6693E] text-white px-8 py-3 rounded-full flex items-center gap-2 font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Explore Publications
          </motion.button>
        </div>
      </section>
      {/* END: HeroSection */}

      {/* BEGIN: MainMergedContainer */}
      <section ref={articlesRef} className="max-w-7xl mx-auto px-8 pb-16 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: 0.55 }}
          className="bg-white rounded-3xl p-8 shadow-[0_10px_50px_rgba(0,0,0,0.08)]"
        >

          {/* Centered Ornate Header Section matching Bookshelf exactly */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.68 }}
            className="flex flex-col items-center justify-center mb-8 pt-4 gap-2"
          >
            <div className="flex items-center gap-4">
              <FlowerSVG />
              <h2 className="text-3xl font-serif font-bold text-[#E6693E] italic tracking-tight">The Articles</h2>
              <div className="scale-x-[-1] flex items-center">
                <FlowerSVG />
              </div>
            </div>
            <div className="w-16 h-[1px] bg-primary/10 mt-1" />
          </motion.div>

          {/* BEGIN: Controls Row matching Bookshelf */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.78 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100"
          >
            <div className="flex flex-wrap items-center gap-4">
              <FilterDropdown
                options={allTags}
                selected={selectedTag}
                onChange={setSelectedTag}
                loading={loading}
                label="Select Tag"
                placeholder="All Tags"
              />

              <AnimatePresence>
                {(selectedTag !== "All" || appliedSearch !== "" || searchInput !== "") && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => {
                      setSelectedTag("All");
                      setAppliedSearch("");
                      setSearchInput("");
                    }}
                    className="text-xs font-sans font-bold uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors cursor-pointer py-3 px-3 rounded-full bg-red-50 border border-red-100 flex items-center gap-1.5 shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Redesigned Minimalist Search Capsule matching Bookshelf */}
            <div className="w-full md:w-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setAppliedSearch(searchInput.trim());
                }}
                className="flex items-center bg-gray-50 rounded-full pl-5 pr-1.5 py-1.5 w-full md:w-96 border border-gray-100 shadow-sm relative group focus-within:border-gray-200 transition-all"
              >
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search articles, topics..."
                  className="w-full bg-transparent border-none text-xs font-serif text-primary outline-none placeholder:text-gray-400 py-1"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1D4E89] hover:bg-opacity-90 text-white transition-all shadow-md active:scale-90 cursor-pointer"
                >
                  <Search size={14} />
                </button>
              </form>
            </div>
          </motion.div>
          {/* END: Controls Row */}

          {/* BEGIN: ArticleGrid */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.88 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10"
          >
            {loading ? (
              // Shimmer Skeletons matching Bookshelf
              [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="book-card p-4 rounded-3xl bg-white border border-gray-100 shadow-md flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="rounded-2xl mb-4 h-48 bg-gray-100 animate-pulse" />
                    <div>
                      <div className="h-4 w-14 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mt-3" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse mt-1.5" />
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="w-full h-8 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))
            ) : filteredArticles.length === 0 ? (
              <div className="col-span-full py-20 text-center space-y-6">
                <p className="text-xl font-serif italic text-primary/30">No transmissions found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchInput("");
                    setAppliedSearch("");
                    setSelectedTag("All");
                  }}
                  className="text-[10px] font-sans font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredArticles.map((article, index) => {
                  const readTime = Math.max(3, Math.min(12, Math.round((article.content?.length || 1000) / 750)));

                  return (
                    <motion.div
                      key={article.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6, delay: index * 0.04 }}
                      className="book-card p-4 rounded-2xl bg-white border border-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-500"
                    >
                      <Link href={`/articles/${article.id}`} className="group flex flex-col h-full justify-between">
                        <div>
                          {/* Cover Image inside pastel containers matching bookshelf */}
                          <div className={`rounded-xl overflow-hidden mb-4 h-48 relative flex items-center justify-center transition-all duration-500 ${getPastelBg(index)}`}>
                            {article.coverImage ? (
                              <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                              />
                            ) : (
                              <div className="h-full w-full relative flex items-center justify-center p-4">
                                <Image
                                  src={getFallbackArticleImage(index)}
                                  alt={article.title}
                                  className="h-full w-auto object-contain transition-all duration-1000 group-hover:scale-105 opacity-85 mix-blend-multiply"
                                />
                              </div>
                            )}
                          </div>

                          {/* Details Area */}
                          <div>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${getBadgeColor(article.tags?.[0] || "General")}`}>
                              {article.tags?.[0] || "General"}
                            </span>

                            <h3 className="mt-2.5 font-bold text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-[#1D4E89] transition-colors">
                              {article.title}
                            </h3>

                            <p className="text-xs text-gray-500 mt-1 italic font-serif line-clamp-3 leading-relaxed">
                              {truncate(article.content || "")}
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-100/50 mt-4">
                          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-4 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar size={10} className="text-gray-400" />
                              {new Date(article.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={10} className="text-gray-400" />
                              {readTime} min read
                            </span>
                          </div>

                          <button className="w-full border border-gray-300 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-[#1D4E89] hover:text-white hover:border-[#1D4E89] transition-all cursor-pointer">
                            Read Article
                          </button>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </motion.div>
          {/* END: ArticleGrid */}

        </motion.div>
      </section>
      {/* END: MainMergedContainer */}

    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, ArrowRight, Clock, Calendar, User, Tag } from "lucide-react";
import { fetchAllArticles, type PublicArticle } from "@/src/lib/articles-api";
import Loader from "@/components/Loader";
import Link from "next/link";

import { SkeletonGrid } from "@/src/components/Skeleton";

function truncate(text: string, max = 150) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<PublicArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<PublicArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

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

  const allTags = ["All", ...Array.from(new Set(articles.flatMap(a => a.tags || [])))];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <section className="pt-16 md:pt-28 md:pb-8">
          <div className="main-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div className="text-center md:text-left animate-pulse">
                <div className="h-2 w-20 bg-primary/5 mb-2" />
                <div className="h-8 w-48 bg-primary/10" />
              </div>
              <div className="w-full max-w-md h-11 bg-primary/5" />
            </div>
          </div>
        </section>
        <div className="main-container py-12">
          <SkeletonGrid count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Hero Section - Matching Bookshelf */}
      <section className="pt-16 md:pt-28 md:pb-8">
        <div className="main-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-2"
              >
                <span className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-primary/30 italic">
                  Archives
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-serif font-black text-primary tracking-tighter"
              >
                The Articles
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-md"
            >
              <form
                className="relative group"
                onSubmit={(e) => {
                  e.preventDefault();
                  setAppliedSearch(searchInput.trim());
                }}
              >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search articles, tags or keywords..."
                  className="w-full h-11 pl-12 pr-32 rounded-none border-b border-primary/10 bg-transparent text-sm font-serif text-primary outline-none focus:border-primary transition-all placeholder:text-primary/20"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-none font-sans font-black text-[9px] uppercase tracking-widest hover:bg-primary/90 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Search
                </button>
              </form>
            </motion.div>
          </div>

          {/* Integrated Tag Filter - Capsules matching Bookshelf */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-2"
          >
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-none text-[10px] font-sans font-black uppercase tracking-[0.15em] transition-all cursor-pointer border ${selectedTag === tag
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-primary/30 border-primary/5 hover:border-primary/20 hover:text-primary/50"
                  }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Articles Grid - Consistency with Bookshelf Padding */}
      <div className="main-container py-12">
        {!filteredArticles.length ? (
          <div className="py-20 text-center space-y-6">
             <p className="text-xl font-serif italic text-primary/30">No transmissions found matching your criteria.</p>
             <button onClick={() => {setSearchInput(""); setAppliedSearch(""); setSelectedTag("All");}} className="text-[10px] font-sans font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1 cursor-pointer">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {filteredArticles.map((article, i) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="group border border-primary/10 hover:border-primary/30 transition-all duration-500 cursor-pointer bg-white flex flex-col h-full"
              >
                <Link href={`/articles/${article.id}`} className="relative aspect-[16/10] overflow-hidden bg-primary/[0.02] border-b border-primary/10">
                  {article.coverImage ? (
                    <img 
                      src={article.coverImage} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/5">
                      <Tag size={64} />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-primary/5">
                      {article.tags?.[0] || "General"}
                    </span>
                  </div>
                </Link>

                <div className="p-5 flex-1 flex flex-col space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[11px] font-sans font-bold text-primary/30 uppercase tracking-widest">
                      <Calendar size={10} /> {new Date(article.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-sans font-bold text-primary/30 uppercase tracking-widest">
                      <Clock size={10} /> 5 min
                    </div>
                  </div>

                  <h2 className="text-xl font-serif font-black text-primary leading-tight tracking-tighter group-hover:italic transition-all">
                    <Link href={`/articles/${article.id}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="text-[13px] font-serif italic text-primary/60 leading-relaxed line-clamp-3">
                    {truncate(article.content || "")}
                  </p>

                  <div className="mt-auto pt-4 border-t border-primary/10 flex justify-between items-center">
                    <Link 
                      href={`/articles/${article.id}`}
                      className="text-[11px] font-sans font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-4 transition-all"
                    >
                      Read <ArrowRight size={14} />
                    </Link>
                    <div className="flex items-center gap-2 text-primary/20">
                      <User size={12} />
                      <span className="text-[11px] font-sans font-bold uppercase tracking-widest">Atelier</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

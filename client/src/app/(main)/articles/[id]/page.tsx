"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ChevronLeft, Clock, Calendar, Share2, Tag, User } from "lucide-react";
import { fetchArticleById, type PublicArticle } from "@/src/lib/articles-api";
import Image from "next/image";
import AnimateIn from "@/src/components/ui/AnimateIn";
import { article1, article2, article3, article4, article5 } from "@/public/images";
import CommentSection from "@/src/components/articles/CommentSection";

const fallbackImages = [article1, article2, article3, article4, article5];
function getFallbackArticleImage(id: string) {
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackImages[index % fallbackImages.length];
}

function getBadgeColor(tag: string) {
  const t = (tag || "").toLowerCase();
  if (t.includes("design") || t.includes("art")) return "bg-[#E6693E]";
  if (t.includes("tech") || t.includes("code")) return "bg-[#008080]";
  if (t.includes("poetry") || t.includes("lit")) return "bg-purple-600";
  if (t.includes("opinion") || t.includes("essay")) return "bg-indigo-600";
  if (t.includes("guide") || t.includes("tutorial")) return "bg-yellow-600";
  return "bg-[#1D4E89]";
}

const ArticleDetails = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [article, setArticle] = useState<PublicArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getArticle = async () => {
      setLoading(true);
      try {
        const data = await fetchArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error("Failed to fetch article:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) void getArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF9F0] pt-32 px-6 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-12 w-3/4 bg-gray-200 rounded" />
          <div className="h-96 w-full bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FDF9F0] pt-32 px-6 text-center">
        <h1 className="text-3xl font-serif font-black text-[#1D4E89]">Transmission Lost</h1>
        <p className="mt-4 text-primary/40 font-serif italic">This article could not be retrieved from the archives.</p>
        <button
          onClick={() => router.back()}
          className="mt-8 px-8 py-3 bg-[#1D4E89] text-white rounded-full font-black text-[10px] uppercase tracking-widest"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const readTime = Math.max(3, Math.min(12, Math.round((article.content?.length || 1000) / 750)));

  return (
    <div className="min-h-screen bg-[#FDF9F0] pb-20">

      <div className="pt-20 px-6 max-w-4xl mx-auto">
        <AnimateIn variant="fade-up" delay={0.1}>
          {/* Metadata & Title */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {article.tags?.map(tag => (
                <span key={tag} className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full text-white ${getBadgeColor(tag)}`}>
                  {tag}
                </span>
              ))}
              <div className="flex items-center gap-4 text-[10px] font-sans font-black uppercase tracking-widest text-[#1D4E89]/40">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Archive Date unknown'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {readTime} min read
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#1D4E89] leading-[1.1] tracking-tight mb-8">
              {article.title}
            </h1>

            <div className="flex items-center gap-3 py-6 border-y border-[#1D4E89]/5">
              <div className="w-10 h-10 rounded-full bg-[#1D4E89]/10 flex items-center justify-center text-[#1D4E89]">
                <User size={20} />
              </div>
              <div>
                <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-[#1D4E89]/40">Dispatched By</span>
                <span className="text-sm font-bold text-[#1D4E89]">Official Member</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-16 relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl group">
            {article.coverImage ? (
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-white flex items-center justify-center p-20">
                <Image
                  src={getFallbackArticleImage(article.id)}
                  alt="Article fallback"
                  className="w-full h-full object-contain opacity-80 mix-blend-multiply"
                />
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2.5rem]" />
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="font-serif text-xl leading-relaxed text-[#1D4E89]/80 space-y-8 first-letter:text-7xl first-letter:font-black first-letter:text-[#E6693E] first-letter:mr-3 first-letter:float-left first-letter:mt-1">
              {article.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-wrap">{paragraph}</p>
              ))}
            </div>
          </article>
          
          {/* Comments Discussion Section */}
          <CommentSection blogId={id} />

          {/* Footer Navigation */}
          <footer className="mt-20 pt-10 border-t border-[#1D4E89]/10">
            <div className="bg-[#1D4E89] rounded-[2rem] p-10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#E6693E] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 block mb-2">End of Transmission</span>
              <h3 className="text-2xl font-serif font-black text-white mb-6">Explore more narratives</h3>
              <button
                onClick={() => router.push('/articles')}
                className="inline-block px-10 py-4 bg-white text-[#1D4E89] font-black text-[10px] uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
              >
                Back to Archive Grid
              </button>
            </div>
          </footer>
        </AnimateIn>
      </div>
    </div>
  );
};

export default ArticleDetails;

import { motion } from "motion/react";
import React, { FormEvent, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Trash2, X, Image as ImageIcon, PenTool, Heart, Clock, Calendar } from "lucide-react";
import type { AuthorArticle } from "@/src/lib/profile-stats-api";
import { deleteArticle, updateArticle } from "@/src/lib/articles-api";
import { useAppStore } from "@/src/lib/store/store";
import { useRouter } from "next/navigation";

export default function ArticleShelf() {
  const router = useRouter();
  const {
    user,
    articles,
    loading,
    fetchArticles,
    fetchCounts
  } = useAppStore();

  const loadingArticles = loading.articles;
  const [editingArticle, setEditingArticle] = useState<AuthorArticle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleEditClick = (article: AuthorArticle) => {
    setEditingArticle(article);
    setPreview(null);
  };

  if (loadingArticles) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-md flex flex-col h-full p-4">
            {/* Cover Aspect Skeleton */}
            <div className="aspect-[4/2.5] bg-primary/5 rounded-2xl" />
            {/* Content Area Skeleton */}
            <div className="pt-6 flex-1 flex flex-col space-y-4">
              <div className="h-3 w-24 bg-primary/5 rounded-full mb-1" />
              <div className="space-y-2">
                <div className="h-6 w-5/6 bg-primary/10 rounded-xl" />
                <div className="h-4 w-full bg-primary/5 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-primary/5 rounded-full" />
                <div className="h-3 w-2/3 bg-primary/5 rounded-full" />
              </div>
              <div className="pt-4 border-t border-gray-50 mt-auto flex justify-between items-center">
                <div className="h-3 w-12 bg-primary/5 rounded-full" />
                <div className="h-3 w-20 bg-primary/10 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!articles.length) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
        <PenTool size={40} className="text-primary/20" />
      </div>
      <h3 className="text-xl font-bold text-primary font-serif mb-2">No articles yet</h3>
      <p className="text-primary/40 text-sm max-w-xs mb-8">Share your thoughts with the world.</p>
    </div>
  );

  const handleDelete = async (id: string, coverId?: string) => {
    if (!window.confirm("Are you sure you want to delete this article?") || !user?.id) return;
    try {
      await deleteArticle(id, coverId);
      await Promise.all([fetchArticles(user.id), fetchCounts(user.id)]);
    } catch {
      alert("Failed to delete article");
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingArticle || !user?.id) return;

    setIsSaving(true);
    const fd = new FormData(e.currentTarget);
    const tags = (fd.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean);
    const file = fd.get("image") as File;

    try {
      await updateArticle(editingArticle.id, {
        title: fd.get("title") as string,
        content: fd.get("content") as string,
        tags,
        coverImageFile: file.size > 0 ? file : undefined,
      });
      setEditingArticle(null);
      await fetchArticles(user.id);
    } catch {
      alert("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
  };

  return (
    <div className="w-full">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
      >
        {articles.map((article) => (
          <motion.article
            variants={item}
            key={article.id}
            className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5"
          >
            <div className="relative aspect-[4/2.5] overflow-hidden bg-zinc-100">
              {article.coverImage ? (
                <img src={article.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="h-full w-full bg-zinc-100 flex items-center justify-center text-[10px] uppercase tracking-widest font-bold text-primary/30">Literary Piece</div>
              )}

              {article.tags && article.tags.length > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white text-[9px] font-sans font-black tracking-widest text-[#E6693E] border border-gray-100 rounded-full">
                    {article.tags[0]}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <motion.button
                  onClick={() => setEditingArticle(article)}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88 }}
                  className="h-8 w-8 flex items-center justify-center bg-white text-primary hover:bg-[#1D4E89] hover:text-white transition-all cursor-pointer border border-[#1D4E89]/10 rounded-lg"
                >
                  <Pencil size={13} />
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(article.id, article.coverImageId)}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88 }}
                  className="h-8 w-8 flex items-center justify-center bg-white text-red-600 hover:bg-red-500 hover:text-white transition-all cursor-pointer border border-red-100 rounded-lg"
                >
                  <Trash2 size={13} />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 flex flex-col p-6">
              <div className="flex items-center gap-4 mb-3 text-[10px] font-sans font-bold text-primary/40 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-primary font-serif leading-tight mb-3 line-clamp-2 cursor-pointer hover:text-primary/70 transition-colors">
                {article.title}
              </h3>

              <p className="text-sm text-primary/80 font-sans line-clamp-2 mb-4 leading-relaxed">
                {article.content}
              </p>

              <div className="mt-auto pt-4 border-t border-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-primary/40">
                  {/* Real stats could go here if available */}
                </div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary cursor-pointer hover:underline transition-all">Read Article</span>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {editingArticle && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A192F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-white shadow-2xl border border-gray-100 rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
              <div>
                <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">Article</p>
                <h2 className="text-2xl font-serif font-bold text-[#0D387D]">Edit Article</h2>
              </div>
              <motion.button
                onClick={() => setEditingArticle(null)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="h-9 w-9 flex items-center justify-center border border-gray-100 rounded-xl text-primary/40 hover:text-primary hover:border-primary transition-all cursor-pointer"
              >
                <X size={16} />
              </motion.button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6 overflow-y-auto max-h-[75vh] scrollbar-hide">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">
                  Title
                </label>
                <input
                  name="title"
                  defaultValue={editingArticle.title}
                  className="h-12 w-full rounded-2xl border border-gray-100 bg-zinc-50 px-4 text-sm font-sans text-gray-900 outline-none transition-all focus:border-primary focus:bg-white"
                  required
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">
                  Content Snippet
                </label>
                <textarea
                  name="content"
                  defaultValue={editingArticle.content}
                  className="min-h-[160px] w-full resize-none rounded-2xl border border-gray-100 bg-zinc-50 p-4 text-sm font-serif italic text-gray-700 outline-none transition-all focus:border-primary focus:bg-white"
                  rows={6}
                  required
                />
              </div>

              {/* Tags & Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">
                    Tags
                    <span className="ml-2 font-normal normal-case tracking-normal text-primary/30">(comma separated)</span>
                  </label>
                  <input
                    name="tags"
                    defaultValue={editingArticle.tags?.join(", ")}
                    placeholder="Poetry, Essay, Fiction"
                    className="h-12 w-full rounded-2xl border border-gray-100 bg-zinc-50 px-4 text-sm font-sans text-gray-900 outline-none transition-all focus:border-primary focus:bg-white placeholder:text-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">
                    Banner Image
                  </label>
                  <div className="relative h-12 border border-gray-100 rounded-2xl bg-zinc-50 flex items-center overflow-hidden">
                    <span className="absolute left-4 text-primary/30 pointer-events-none">
                      <ImageIcon size={14} />
                    </span>
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      className="h-full w-full pl-10 pr-4 text-[10px] font-sans font-bold text-primary/40 bg-transparent outline-none file:hidden cursor-pointer"
                    />
                    <span className="absolute right-4 text-[10px] font-sans font-bold uppercase tracking-widest text-primary/30 pointer-events-none">
                      Choose
                    </span>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {preview && (
                <div className="space-y-2">
                  <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">Preview</p>
                  <div className="aspect-[16/6] overflow-hidden border border-primary/10">
                    <img src={preview} alt="Banner preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-2 border-t border-primary/10">
                <motion.button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-12 flex-1 rounded-2xl border border-gray-100 bg-transparent text-[10px] font-sans font-black uppercase tracking-[0.2em] text-primary/60 transition-all hover:border-primary/40 hover:text-primary cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSaving}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-12 flex-[2] rounded-2xl bg-primary text-[10px] font-sans font-black uppercase tracking-[0.2em] text-white transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/20"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

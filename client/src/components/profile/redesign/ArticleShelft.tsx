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
          <div key={i} className="animate-pulse bg-white border border-primary/10 rounded-none flex flex-col h-full">
            {/* Cover Aspect Skeleton */}
            <div className="aspect-[4/2.5] bg-primary/5 rounded-none border-b border-primary/5" />
            {/* Content Area Skeleton */}
            <div className="p-6 flex-1 flex flex-col space-y-4">
              <div className="h-3 w-24 bg-primary/5 rounded-none mb-1" />
              <div className="space-y-2">
                <div className="h-6 w-5/6 bg-primary/10 rounded-none" />
                <div className="h-4 w-full bg-primary/5 rounded-none" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-primary/5 rounded-none" />
                <div className="h-3 w-2/3 bg-primary/5 rounded-none" />
              </div>
              <div className="pt-4 border-t border-primary/5 mt-auto flex justify-between items-center">
                <div className="h-3 w-12 bg-primary/5 rounded-none" />
                <div className="h-3 w-20 bg-primary/10 rounded-none" />
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
            className="group flex flex-col bg-white border border-primary/10 rounded-none transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative aspect-[4/2.5] overflow-hidden bg-zinc-100">
              {article.coverImage ? (
                <img src={article.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="h-full w-full bg-zinc-100 flex items-center justify-center text-[10px] uppercase tracking-widest font-bold text-primary/30">Literary Piece</div>
              )}

              {article.tags && article.tags.length > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white text-[10px] font-sans font-semibold tracking-widest text-primary border border-primary/10">
                    {article.tags[0]}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <button onClick={() => setEditingArticle(article)} className="h-8 w-8 flex items-center justify-center bg-white text-primary hover:bg-primary hover:text-white transition-all cursor-pointer border border-primary/10">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(article.id, article.coverImageId)} className="h-8 w-8 flex items-center justify-center bg-white text-red-600 hover:bg-red-500 hover:text-white transition-all cursor-pointer border border-primary/10">
                  <Trash2 size={14} />
                </button>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/20 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-white overflow-hidden">
            <div className="px-10 py-8 border-b border-primary/5 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary font-serif">Edit Article</h2>
              <button onClick={() => setEditingArticle(null)} className="p-2 rounded-full hover:bg-primary/5 text-primary/40 cursor-pointer transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-10 space-y-8 overflow-y-auto max-h-[80vh]">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Title</label>
                <input name="title" defaultValue={editingArticle.title} className="w-full h-14 bg-primary/[0.03] border border-primary/5 rounded-2xl px-6 text-sm font-bold text-primary outline-none focus:border-primary/20 transition-all" required />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Content Snippet</label>
                <textarea name="content" defaultValue={editingArticle.content} className="w-full min-h-[160px] bg-primary/[0.03] border border-primary/5 rounded-[2rem] p-6 text-sm font-serif italic text-primary/70 outline-none focus:border-primary/20 transition-all resize-none" required />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Tags</label>
                  <input name="tags" defaultValue={editingArticle.tags?.join(", ")} className="w-full h-14 bg-primary/[0.03] border border-primary/5 rounded-2xl px-6 text-sm font-bold text-primary outline-none focus:border-primary/20 transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Banner Image</label>
                  <input name="image" type="file" accept="image/*" className="w-full h-14 bg-primary/[0.03] border border-primary/5 rounded-2xl px-6 py-4 text-[10px] font-bold text-primary/30" />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setEditingArticle(null)} className="h-14 flex-1 rounded-2xl border-2 border-primary/5 text-xs font-black uppercase tracking-widest text-primary/40 hover:bg-primary/5 transition-all cursor-pointer">Cancel</button>
                <button disabled={isSaving} className="h-14 flex-[2] rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

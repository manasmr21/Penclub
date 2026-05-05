import React, { FormEvent, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Trash2, X, Image as ImageIcon } from "lucide-react";
import type { AuthorArticle } from "@/src/lib/profile-stats-api";
import { deleteArticle, updateArticle } from "@/src/lib/articles-api";
import Loader from "@/components/Loader";
import { Skeleton } from "@/src/components/ui/skeleton";

const ArticleCardSkeleton = () => (
  <div className="relative flex flex-col rounded-2xl border border-outline-variant/20 bg-white p-5 shadow-sm animate-pulse">
    <div className="mb-4 h-44 overflow-hidden rounded-xl">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-6 w-3/4 rounded-sm" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-sm" />
        <Skeleton className="h-4 w-full rounded-sm" />
        <Skeleton className="h-4 w-2/3 rounded-sm" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

import { useAppStore } from "@/src/lib/store/store";

export default function ArticleShelf() {
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
      <div className="w-full px-3 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  if (!articles.length) return <StatusMessage message="No articles found" />;

  const handleDelete = async (id: string, coverId?: string) => {
    if (!window.confirm("Are you sure?") || !user?.id) return;
    try {
      await deleteArticle(id, coverId);
      await Promise.all([
        fetchArticles(user.id),
        fetchCounts(user.id)
      ]);
    } catch (err) {
      alert("Failed to delete");
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

  return (
    <div className="w-full px-3 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {articles.map((article) => (
          <article key={article.id} className="relative flex h-full flex-col rounded-2xl border border-outline-variant/20 bg-white p-5 shadow-sm">
            
            {/* Action Buttons - Always Visible */}
            <div className="absolute top-3 right-3 flex gap-1.5 z-10">
              <button onClick={() => handleEditClick(article)} className="h-7 w-7 grid place-items-center rounded-full bg-slate-100 text-[#1e2741]">
                <Pencil size={14} />
              </button>
              <button onClick={() => handleDelete(article.id, article.coverImageId)} className="h-7 w-7 grid place-items-center rounded-full bg-red-50 text-red-600">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="mb-4 h-44 overflow-hidden rounded-xl bg-slate-100">
              {article.coverImage ? (
                <img src={article.coverImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-sm text-slate-400">No banner image</div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-primary">{article.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-on-surface-variant/80">
              {article.content}
            </p>

            <div className="mt-auto pt-4 flex flex-wrap gap-2">
              {article.tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">#{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {editingArticle && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col items-center py-20 px-4 bg-slate-900/40 backdrop-blur-md transition-all animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl max-h-[calc(100vh-10rem)] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 animate-in slide-in-from-top-8 duration-300 scrollbar-hide">
            <button 
              onClick={() => setEditingArticle(null)}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center mb-4 text-center">
              <h2 className="text-xl font-bold text-[#1e2741]">Edit Article</h2>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Image Section */}
              <div className="space-y-1">
                <label className="ml-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Cover Image</label>
                <div className="relative group aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img 
                    src={preview || editingArticle.coverImage || "/placeholder-article.png"} 
                    alt="Preview" 
                    className="h-full w-full object-cover transition-opacity group-hover:opacity-40" 
                  />
                  <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 transition group-hover:opacity-100">
                    <div className="flex flex-col items-center gap-2 text-slate-900">
                      <ImageIcon size={24} />
                      <span className="text-sm font-semibold">Replace Image</span>
                    </div>
                    <input 
                      name="image" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="ml-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Title</label>
                  <input 
                    name="title" 
                    defaultValue={editingArticle.title} 
                    className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:ring-2 focus:ring-primary focus:bg-white" 
                    placeholder="Article title" 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="ml-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Content</label>
                  <textarea 
                    name="content" 
                    defaultValue={editingArticle.content} 
                    className="w-full min-h-[140px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:ring-2 focus:ring-primary focus:bg-white resize-none" 
                    placeholder="Tell your story..." 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="ml-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Tags (Comma separated)</label>
                  <input 
                    name="tags" 
                    defaultValue={editingArticle.tags?.join(", ")} 
                    className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:ring-2 focus:ring-primary focus:bg-white" 
                    placeholder="writing, inspiration, art" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingArticle(null)} 
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={isSaving} 
                  className="px-7 py-2 rounded-xl text-sm bg-primary font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

const StatusMessage = ({ message }: { message: string }) => (
  <div className="py-20 text-center text-on-surface-variant/70">{message}</div>
);

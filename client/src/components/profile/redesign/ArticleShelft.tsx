import React, { FormEvent, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
          <article key={article.id} className="relative flex flex-col rounded-2xl border border-outline-variant/20 bg-white p-5 shadow-sm">
            
            {/* Action Buttons - Always Visible */}
            <div className="absolute top-3 right-3 flex gap-1.5 z-10">
              <button onClick={() => setEditingArticle(article)} className="h-7 w-7 grid place-items-center rounded-full bg-slate-100 text-[#1e2741]">
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

            <div className="mt-3 flex flex-wrap gap-2">
              {article.tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">#{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {editingArticle && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4">
          <form onSubmit={handleUpdate} className="w-full max-w-xl rounded-2xl bg-white p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold text-[#1e2741]">Edit Article</h2>
            <input name="title" defaultValue={editingArticle.title} className="w-full border rounded-md p-3" placeholder="Title" required />
            <textarea name="content" defaultValue={editingArticle.content} className="w-full border rounded-md p-3 min-h-32" placeholder="Content" required />
            <input name="tags" defaultValue={editingArticle.tags?.join(", ")} className="w-full border rounded-md p-3" placeholder="Tags (comma separated)" />
            <input name="image" type="file" accept="image/*" className="w-full border rounded-md p-3" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingArticle(null)} className="px-4 py-2 border rounded-md">Cancel</button>
              <button disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50">
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const StatusMessage = ({ message }: { message: string }) => (
  <div className="py-20 text-center text-on-surface-variant/70">{message}</div>
);

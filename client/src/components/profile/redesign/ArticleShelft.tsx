import React, { FormEvent, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { AuthorArticle } from "@/src/lib/profile-stats-api";
import { deleteArticle, updateArticle } from "@/src/lib/books-api";

type ArticleShelftProps = {
  articles: AuthorArticle[];
  loading?: boolean;
  onChanged?: () => Promise<void> | void;
};

function truncate(text: string, max = 120) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

const ArticleShelft = ({ articles, loading = false, onChanged }: ArticleShelftProps) => {
  const [editingArticle, setEditingArticle] = useState<AuthorArticle | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  function openEditModal(article: AuthorArticle) {
    setEditingArticle(article);
    setTitle(article.title || "");
    setContent(article.content || "");
    setTagsInput((article.tags || []).join(", "));
    setCoverImageFile(undefined);
  }

  function closeEditModal() {
    setEditingArticle(null);
    setTitle("");
    setContent("");
    setTagsInput("");
    setCoverImageFile(undefined);
  }

  async function handleEditSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingArticle?.id) return;

    setIsSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      await updateArticle(editingArticle.id, {
        title,
        content,
        tags,
        coverImageFile,
      });
      closeEditModal();
      await onChanged?.();
    } catch (error) {
      const maybeError = error as { response?: { data?: { message?: string } } };
      alert(maybeError.response?.data?.message ?? "Failed to update article.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(articleId: string, coverImageId?: string) {
    const confirmed = window.confirm("Are you sure you want to delete this article?");
    if (!confirmed) return;

    try {
      await deleteArticle(articleId, coverImageId);
      await onChanged?.();
    } catch (error) {
      const maybeError = error as { response?: { data?: { message?: string } } };
      alert(maybeError.response?.data?.message ?? "Failed to delete article.");
    }
  }

  if (loading) {
    return (
      <div className="w-full pb-16">
        <div className="max-w-5xl mx-auto text-center py-20 text-on-surface-variant/70">
          Loading articles...
        </div>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="w-full pb-16">
        <div className="max-w-5xl mx-auto text-center py-20 text-on-surface-variant/70">
          No articles found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-16 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {articles.map((article) => (
          <article key={article.id} className="relative flex h-full flex-col rounded-2xl border border-outline-variant/20 bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-4 overflow-hidden rounded-xl bg-slate-100">
              {article.coverImage ? (
                <img
                  src={article.coverImage}
                  alt={`${article.title} banner`}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="grid h-44 w-full place-items-center text-sm text-on-surface-variant/70">
                  No banner image
                </div>
              )}
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => openEditModal(article)}
                className="h-7 w-7 grid place-items-center rounded-full bg-slate-100 text-[#1e2741]"
                aria-label={`Edit ${article.title}`}
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(article.id, article.coverImageId)}
                className="h-7 w-7 grid place-items-center rounded-full bg-red-50 text-red-600"
                aria-label={`Delete ${article.title}`}
              >
                <Trash2 size={14} />
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-primary">{article.title}</h3>
            <p className="mt-2 text-sm text-on-surface-variant/80 leading-relaxed">
              {truncate(article.content || "")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(article.tags || []).map((tag) => (
                <span key={`${article.id}-${tag}`} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-3 sm:px-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-[#1e2741]">Edit Article</h2>
            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3">
              <input
                className="w-full border rounded-md p-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
              />
              <textarea
                className="w-full border rounded-md p-3 min-h-32"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                required
              />
              <input
                className="w-full border rounded-md p-3"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Tags (comma separated)"
              />
              <input
                type="file"
                accept="image/*"
                className="w-full border rounded-md p-3"
                onChange={(e) => setCoverImageFile(e.target.files?.[0])}
              />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 rounded-md border"
                  onClick={closeEditModal}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 rounded-md bg-primary text-white disabled:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleShelft;

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createArticle } from "@/src/lib/books-api";
import { useAppStore } from "@/src/lib/store/store";
import { extractErrorMessage } from "@/src/lib/http-client";

export default function PostArticlePage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const hydrated = useAppStore((s) => s.hydrated);
  const setError = useAppStore((s) => s.setError);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user?.id) {
      alert("User not found. Please sign in again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const response = await createArticle({
        title,
        content,
        tags,
        userId: user.id,
        coverImageFile,
      });

      alert(response?.message ?? "Article posted successfully.");
      setTitle("");
      setContent("");
      setTagsInput("");
      setCoverImageFile(undefined);
      router.push("/profile?tab=Articles");
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to post article.");
      setError(message);
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hydrated) {
    return <div className="pt-16 px-4 text-[var(--foreground)]">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-16">
        <h1 className="text-2xl font-semibold mb-3 text-[var(--foreground)]">Post Article</h1>
        <p className="mb-4 text-[var(--muted-foreground)]">Please sign in to post an article.</p>
        <Link className="underline text-[var(--primary)]" href="/sign-in">
          Go to sign in
        </Link>
      </div>
    );
  }

  if (user.role !== "author") {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-16">
        <h1 className="text-2xl font-semibold mb-3 text-[var(--foreground)]">Post Article</h1>
        <p className="text-[var(--muted-foreground)]">Only authors can post articles.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 mb-12 w-full max-w-xl px-3 sm:px-4">
      <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8 shadow-sm">
        <button
          type="button"
          onClick={() => router.push("/profile?tab=Articles")}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] transition hover:bg-[var(--muted)]/60 sm:right-4 sm:top-4"
          aria-label="Close post article form"
        >
          <X size={18} />
        </button>
        <div className="mb-5 sm:mb-6">
          <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">Post Article</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="space-y-1.5">
              <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                Title
              </label>
              <input
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[#f3f4f6] px-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div> 

            <div className="space-y-1.5">
              <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                Tags
              </label>
              <input
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[#f3f4f6] px-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Tags (comma separated)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
              Content
            </label>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-[#f3f4f6] p-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Write your content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
              Cover Image
            </label>
            <input
              className="block w-full cursor-pointer rounded-xl border border-[var(--border)] bg-[#f3f4f6] text-sm text-[var(--muted-foreground)] file:mr-4 file:h-11 file:border-0 file:bg-[var(--primary)] file:px-4 file:text-sm file:font-semibold file:text-[var(--primary-foreground)]"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImageFile(e.target.files?.[0])}
            />
          </div>

          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-[var(--primary)] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Article"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
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
    /* Added bg-white to the wrapper */
    <div className="relative mx-auto max-w-xl mt-25 mb-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
      <div className="mx-auto max-w-2xl px-4 pb-6 text-black">
        <div className="mb-4">
          <h1 className="text-3xl text-center font-extrabold tracking-tight">Post Article</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="space-y-1.5">
              <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                Title
              </label>
              {/* Changed bg to gray-100 */}
              <input
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div> 

            <div className="space-y-1.5">
              <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                Tags
              </label>
              {/* Changed bg to gray-100 */}
              <input
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Tags (comma separated)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
              Content
            </label>
            {/* Changed bg to gray-100 */}
            <textarea
              className="min-h-30 w-full rounded-xl border border-gray-200 bg-gray-100 p-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Write your content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
              Cover Image
            </label>
            {/* Changed bg to gray-100 */}
            <input
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 pt-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-3 file:py-1.5 file:text-white"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImageFile(e.target.files?.[0])}
            />
          </div>

          <button
            type="submit"
            className="h-14 w-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--secondary))] font-semibold text-white shadow-[0_12px_30px_rgba(10,56,125,0.2)] transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Article"}
          </button>
        </form>

      </div>
    </div>
  );
}

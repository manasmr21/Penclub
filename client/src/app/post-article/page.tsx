"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createArticle } from "@/src/lib/books-api";
import { useAppStore } from "@/src/lib/store/store";

export default function PostArticlePage() {
  const user = useAppStore((s) => s.user);
  const hydrated = useAppStore((s) => s.hydrated);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user?.id) {
      setMessage("User not found. Please sign in again.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

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

      setMessage(response?.message ?? "Article posted successfully.");
      setTitle("");
      setContent("");
      setTagsInput("");
      setCoverImageFile(undefined);
    } catch (error) {
      const maybeError = error as { response?: { data?: { message?: string } } };
      setMessage(maybeError.response?.data?.message ?? "Failed to post article.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hydrated) {
    return <div className="pt-28 px-4">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-28">
        <h1 className="text-2xl font-semibold mb-3">Post Article</h1>
        <p className="mb-4">Please sign in to post an article.</p>
        <Link className="underline" href="/sign-in">
          Go to sign in
        </Link>
      </div>
    );
  }

  if (user.role !== "author") {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-28">
        <h1 className="text-2xl font-semibold mb-3">Post Article</h1>
        <p>Only authors can post articles.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-10">
      <h1 className="text-2xl font-semibold mb-6">Post Article</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full border rounded-md p-3"
          placeholder="Article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded-md p-3 min-h-40"
          placeholder="Write your content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-md p-3"
          placeholder="Tags (comma separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />

        <input
          className="w-full border rounded-md p-3"
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImageFile(e.target.files?.[0])}
        />

        <button
          type="submit"
          className="px-5 py-2 rounded-md border disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post Article"}
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

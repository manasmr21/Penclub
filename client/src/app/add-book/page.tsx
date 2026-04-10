"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBook } from "@/src/lib/books-api";
import { useAppStore } from "@/src/lib/store/store";
import { extractErrorMessage } from "@/src/lib/http-client";

export default function AddBookPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const hydrated = useAppStore((s) => s.hydrated);
  const setError = useAppStore((s) => s.setError);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [purchaseLinksInput, setPurchaseLinksInput] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const purchaseLinks = purchaseLinksInput
        .split(",")
        .map((link) => link.trim())
        .filter(Boolean);

      const response = await createBook({
        title,
        description,
        genre,
        releaseDate: releaseDate || undefined,
        purchaseLinks,
        coverImageFile,
      });

      alert(response?.message ?? "Book submitted successfully!");
      setTitle("");
      setDescription("");
      setGenre("");
      setReleaseDate("");
      setPurchaseLinksInput("");
      setCoverImageFile(undefined);
      router.push("/profile?tab=Bookshelf");
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to submit book.");
      setError(message);
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hydrated) {
    return <div className="pt-20 px-4 text-[var(--foreground)]">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-16">
        <h1 className="text-2xl font-semibold mb-3 text-[var(--foreground)]">Add Book</h1>
        <p className="mb-4 text-[var(--muted-foreground)]">Please sign in to add a book.</p>
        <Link className="underline text-[var(--primary)]" href="/sign-in">
          Go to sign in
        </Link>
      </div>
    );
  }

  if (user.role !== "author") {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-16">
        <h1 className="text-2xl font-semibold mb-3 text-[var(--foreground)]">Add Book</h1>
        <p className="text-[var(--muted-foreground)]">Only authors can add books.</p>
      </div>
    );
  }

  const inputBgClass = "bg-[#f3f4f6]";

  return (
    <div className="relative mx-auto max-w-xl mt-24 mb-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-center text-[var(--foreground)]">Add Book</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Title</label>
          <input
            className={`h-11 w-full rounded-xl border border-[var(--border)] ${inputBgClass} px-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]`}
            placeholder="Enter book title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Genre</label>
            <input
              className={`h-11 w-full rounded-xl border border-[var(--border)] ${inputBgClass} px-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]`}
              placeholder="e.g. Fantasy"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Publication Date</label>
            <input
              className={`h-11 w-full rounded-xl border border-[var(--border)] ${inputBgClass} px-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]`}
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Description</label>
          <textarea
            className={`min-h-[100px] w-full rounded-xl border border-[var(--border)] ${inputBgClass} p-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]`}
            placeholder="Briefly summarize the book..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Purchase Links</label>
          <input
            className={`h-11 w-full rounded-xl border border-[var(--border)] ${inputBgClass} px-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]`}
            placeholder="Paste links (comma separated)"
            value={purchaseLinksInput}
            onChange={(e) => setPurchaseLinksInput(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Cover Image</label>
          <input
            className={`block w-full cursor-pointer rounded-xl border border-[var(--border)] ${inputBgClass} text-sm text-[var(--muted-foreground)] file:mr-4 file:h-11 file:border-0 file:bg-[var(--primary)] file:px-4 file:text-sm file:font-semibold file:text-[var(--primary-foreground)] hover:file:opacity-90`}
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImageFile(e.target.files?.[0])}
          />
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-[var(--primary)] font-bold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}

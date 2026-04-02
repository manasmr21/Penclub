"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createBook } from "@/src/lib/books-api";
import { useAppStore } from "@/src/lib/store/store";

export default function AddBookPage() {
  const user = useAppStore((s) => s.user);
  const hydrated = useAppStore((s) => s.hydrated);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [purchaseLinksInput, setPurchaseLinksInput] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

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

      setMessage(response?.message ?? "Book submitted successfully.");
      setTitle("");
      setDescription("");
      setGenre("");
      setReleaseDate("");
      setPurchaseLinksInput("");
      setCoverImageFile(undefined);
    } catch (error) {
      const maybeError = error as { response?: { data?: { message?: string } } };
      setMessage(maybeError.response?.data?.message ?? "Failed to submit book.");
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
        <h1 className="text-2xl font-semibold mb-3">Add Book</h1>
        <p className="mb-4">Please sign in to add a book.</p>
        <Link className="underline" href="/sign-in">
          Go to sign in
        </Link>
      </div>
    );
  }

  if (user.role !== "author") {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-28">
        <h1 className="text-2xl font-semibold mb-3">Add Book</h1>
        <p>Only authors can add books.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-10">
      <h1 className="text-2xl font-semibold mb-6">Add Book</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full border rounded-md p-3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded-md p-3 min-h-32"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-md p-3"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-md p-3"
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />

        <input
          className="w-full border rounded-md p-3"
          placeholder="Purchase links (comma separated)"
          value={purchaseLinksInput}
          onChange={(e) => setPurchaseLinksInput(e.target.value)}
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
          {isSubmitting ? "Submitting..." : "Submit Book"}
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

import React, { FormEvent, useState } from 'react';
import { Pencil, Star, Trash2 } from 'lucide-react';
import type { AuthorBook } from "@/src/lib/profile-stats-api";
import { deleteBook, updateBook } from "@/src/lib/books-api";

type BookShelftProps = {
  books: AuthorBook[];
  loading?: boolean;
  onChanged?: () => Promise<void> | void;
};

const BookShelft = ({ books, loading = false, onChanged }: BookShelftProps) => {
  const [editingBook, setEditingBook] = useState<AuthorBook | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  function openEditModal(book: AuthorBook) {
    setEditingBook(book);
    setTitle(book.title || "");
    setDescription(book.description || "");
    setGenre(book.genre || "");
    setCoverImageFile(undefined);
  }

  function closeEditModal() {
    setEditingBook(null);
    setTitle("");
    setDescription("");
    setGenre("");
    setCoverImageFile(undefined);
  }

  async function handleEditSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingBook?.id) return;

    setIsSaving(true);
    try {
      await updateBook(editingBook.id, {
        title,
        description,
        genre,
        coverImageFile,
      });
      closeEditModal();
      await onChanged?.();
    } catch (error) {
      const maybeError = error as { response?: { data?: { message?: string } } };
      alert(maybeError.response?.data?.message ?? "Failed to update book.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(bookId: string) {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (!confirmed) return;

    try {
      await deleteBook(bookId);
      await onChanged?.();
    } catch (error) {
      const maybeError = error as { response?: { data?: { message?: string } } };
      alert(maybeError.response?.data?.message ?? "Failed to delete book.");
    }
  }

  if (loading) {
    return (
      <div className="w-full pb-16">
        <div className="max-w-4xl mx-auto text-center py-20 text-on-surface-variant/70">
          Loading books...
        </div>
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="w-full pb-16">
        <div className="max-w-4xl mx-auto text-center py-20 text-on-surface-variant/70">
          No books found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-12">
          {books.map((book) => (
            <div key={book.id} className="relative flex flex-col group cursor-pointer w-full max-w-56 mx-auto">
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(book)}
                  className="h-7 w-7 grid place-items-center rounded-full bg-white/90 text-[#1e2741] shadow-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Edit ${book.title}`}
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(book.id)}
                  className="h-7 w-7 grid place-items-center rounded-full bg-white/90 text-red-600 shadow-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Delete ${book.title}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="w-full aspect-[2/3] mb-6 bg-gray-200">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-on-surface-variant/70 text-sm px-4 text-center">
                    No cover image
                  </div>
                )}
              </div>

              <div className="flex flex-col px-1">
                <h3 className="text-[17px] font-bold text-[#1e2741] tracking-normal leading-snug">{book.title}</h3>
                <p className="text-[#697282] italic text-[15px] mt-[2px] font-serif capitalize">{book.genre}</p>
                <div className="flex gap-[3px] mt-2.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-[#ffaf8e] text-[#ffaf8e]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingBook && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6">
            <h2 className="text-xl font-semibold text-[#1e2741]">Edit Book</h2>
            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3">
              <input
                className="w-full border rounded-md p-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
              />
              <textarea
                className="w-full border rounded-md p-3 min-h-28"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
              />
              <input
                className="w-full border rounded-md p-3"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Genre"
                required
              />
              <input
                type="file"
                accept="image/*"
                className="w-full border rounded-md p-3"
                onChange={(e) => setCoverImageFile(e.target.files?.[0])}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border"
                  onClick={closeEditModal}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-50"
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

export default BookShelft;

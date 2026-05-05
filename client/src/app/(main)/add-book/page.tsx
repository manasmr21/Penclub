"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Image as ImageIcon } from "lucide-react";
import { createBook } from "@/src/lib/books-api";
import { useAppStore } from "@/src/lib/store/store";
import { extractErrorMessage } from "@/src/lib/http-client";

export default function AddBookPage() {
  const router = useRouter();
  const { user, hydrated, setError } = useAppStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    releaseDate: "",
    purchaseLinks: "",
    authorname: "",
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !formData.authorname) {
      setFormData(prev => ({
        ...prev,
        authorname: user.name || user.username || ""
      }));
    }
  }, [user, hydrated]);

  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }
    const objectUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
  }, [files]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const links = formData.purchaseLinks.split(",").map(l => l.trim()).filter(Boolean);
      await createBook({ ...formData, purchaseLinks: links, coverImageFiles: files });
      router.push("/profile?tab=Bookshelf");
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to submit book.");
      setError(msg);
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hydrated) return <div className="p-20 text-center text-[var(--muted-foreground)]">Loading...</div>;
  if (!user) return <AuthPrompt title="Add Book" message="Sign in to add a book." link="/sign-in" />;
  if (user.role !== "author") return <AuthPrompt title="Add Book" message="Only authors can add books." />;

  return (
    // max-w-[30rem] sets the width exactly as requested
    <main className="mx-auto mt-32 mb-12 max-w-[30rem] px-4">
      <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-sm">
        <button 
          onClick={() => router.back()} 
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
        >
          <X size={20} />
        </button>

        <h1 className="mb-8 text-center text-2xl font-bold tracking-tight">Add New Book</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Title">
            <input required placeholder="Enter title" className={inputStyle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </Field>

          <Field label="Author Name">
            <input required placeholder="Enter author name" className={inputStyle} value={formData.authorname} onChange={e => setFormData({...formData, authorname: e.target.value})} />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Genre">
              <input required placeholder="e.g. Fantasy" className={inputStyle} value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
            </Field>
            <Field label="Release Date">
              <input type="date" className={inputStyle} value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
            </Field>
          </div>

          <Field label="Description">
            <textarea 
              required 
              rows={6} 
              placeholder="What's the story about?"
              className={`${inputStyle} py-3 resize-none`} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </Field>

          <Field label="Purchase Links">
            <input placeholder="Amazon, Apple (comma separated)" className={inputStyle} value={formData.purchaseLinks} onChange={e => setFormData({...formData, purchaseLinks: e.target.value})} />
          </Field>

          <Field label="Book Covers">
            <div className="group relative">
              <input 
                type="file" multiple accept="image/*"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files ?? [])])}
              />
              <div className={`${inputStyle} flex items-center justify-center border-dashed bg-transparent py-4 text-[var(--muted-foreground)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]`}>
                <ImageIcon className="mr-2" size={18} />
                <span className="text-xs font-semibold">Upload cover images</span>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {previews.map((url, i) => (
                  <div key={url} className="relative h-24 w-16 flex-shrink-0 rounded-lg border border-[var(--border)] bg-cover bg-center shadow-md" style={{ backgroundImage: `url(${url})` }}>
                    <button 
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-12 rounded-xl bg-[var(--primary)] font-bold text-[var(--primary-foreground)] active:scale-[0.98] disabled:opacity-50 mt-2 transition-all hover:opacity-90"
          >
            {isSubmitting ? "Processing..." : "Add to Bookshelf"}
          </button>
        </form>
      </div>
    </main>
  );
}

const inputStyle = "w-full rounded-xl border border-[var(--border)] bg-[#f3f4f6] px-4 h-11 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all placeholder:text-gray-400";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="ml-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</label>
      {children}
    </div>
  );
}

function AuthPrompt({ title, message, link }: { title: string; message: string; link?: string }) {
  return (
    <div className="max-w-[30rem] mx-auto px-4 pt-32 text-center">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-[var(--muted-foreground)] mb-4">{message}</p>
      {link && <Link href={link} className="text-[var(--primary)] underline font-medium">Sign in here</Link>}
    </div>
  );
}

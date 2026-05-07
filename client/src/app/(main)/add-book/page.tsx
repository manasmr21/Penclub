"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
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

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#FDF9F0]/60 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20" />
          <div className="h-4 w-24 bg-primary/10 rounded-full" />
        </div>
      </div>
    );
  }

  if (!user) return <AuthPrompt title="Add Book" message="Sign in to add a book." link="/sign-in" />;
  if (user.role !== "author") return <AuthPrompt title="Add Book" message="Only authors can add books." />;

  return (
    <div className="relative min-h-screen bg-[#FDF9F0]/60 pt-20 pb-20 px-4">
      <div className="mx-auto max-w-2xl border border-gray-100 bg-white p-8 sm:p-10 rounded-3xl shadow-xl relative mt-4">
        <motion.button
          onClick={() => router.back()}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-5 top-5 h-10 w-10 flex items-center justify-center border border-gray-100 bg-[#FDF9F0]/50 rounded-full text-[#1D4E89] hover:bg-[#1D4E89] hover:text-white transition-colors duration-200 cursor-pointer"
        >
          <X size={18} />
        </motion.button>

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-serif font-bold text-[#1D4E89] tracking-tight mt-1">Add New Book</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Title">
            <input required placeholder="Enter title" className={inputStyle} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </Field>

          <Field label="Author Name">
            <input required placeholder="Enter author name" className={inputStyle} value={formData.authorname} onChange={e => setFormData({ ...formData, authorname: e.target.value })} />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Genre">
              <input required placeholder="e.g. Fantasy" className={inputStyle} value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })} />
            </Field>
            <Field label="Release Date">
              <input type="date" className={inputStyle} value={formData.releaseDate} onChange={e => setFormData({ ...formData, releaseDate: e.target.value })} />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              required
              rows={6}
              placeholder="What's the story about?"
              className={`${inputStyle} h-auto py-4 resize-none`}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </Field>

          <Field label="Purchase Links">
            <input placeholder="Amazon, Apple (comma separated)" className={inputStyle} value={formData.purchaseLinks} onChange={e => setFormData({ ...formData, purchaseLinks: e.target.value })} />
          </Field>

          <Field label="Book Covers">
            <div className="group relative">
              <input
                type="file" multiple accept="image/*"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files ?? [])])}
              />
              <div className="h-16 flex items-center justify-center border-2 border-dashed border-gray-200 bg-[#FDF9F0]/30 rounded-2xl text-[#1D4E89]/50 group-hover:border-[#1D4E89] group-hover:text-[#1D4E89] transition-all duration-300">
                <ImageIcon className="mr-2" size={18} />
                <span className="text-[10px] font-sans font-black uppercase tracking-widest">Upload Cover Images</span>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {previews.map((url, i) => (
                  <div key={url} className="relative h-28 w-20 flex-shrink-0 border border-gray-100 rounded-xl overflow-hidden bg-cover bg-center shadow-md" style={{ backgroundImage: `url(${url})` }}>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeFile(i)}
                      className="absolute right-1.5 top-1.5 h-6 w-6 rounded-full flex items-center justify-center bg-[#1D4E89] text-white hover:bg-[#E6693E] transition-colors cursor-pointer"
                    >
                      <X size={12} strokeWidth={3} />
                    </motion.button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="w-full h-14 rounded-2xl bg-[#1D4E89] text-white hover:bg-[#11325C] font-sans font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#1D4E89]/20 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? "Processing..." : "Add to Bookshelf"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = "w-full border-2 border-gray-100 bg-[#FDF9F0]/40 px-4 py-3.5 text-sm font-sans font-bold text-[#1D4E89] placeholder:text-[#1D4E89]/30 outline-none transition-all duration-300 focus:border-[#1D4E89] focus:bg-white rounded-2xl";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#1D4E89]/60">{label}</label>
      {children}
    </div>
  );
}

function AuthPrompt({ title, message, link }: { title: string; message: string; link?: string }) {
  return (
    <div className="min-h-screen bg-[#FDF9F0]/60 flex items-center justify-center px-4">
      <div className="max-w-md w-full border border-gray-100 bg-white p-8 sm:p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-3xl font-serif font-bold text-[#1D4E89] mb-2">{title}</h1>
        <p className="text-sm font-sans italic text-[#1D4E89]/60 mb-6">{message}</p>
        {link && (
          <Link href={link}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-block px-8 py-3.5 bg-[#E6693E] text-white font-sans font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg cursor-pointer hover:bg-[#d5582f]"
            >
              Sign In Here
            </motion.div>
          </Link>
        )}
      </div>
    </div>
  );
}

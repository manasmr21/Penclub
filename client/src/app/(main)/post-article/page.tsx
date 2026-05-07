"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { X, Image as ImageIcon } from "lucide-react";
import { createArticle } from "@/src/lib/articles-api";
import { useAppStore } from "@/src/lib/store/store";
import { extractErrorMessage } from "@/src/lib/http-client";

const inputClasses = "w-full border-2 border-gray-100 bg-white px-4 py-3.5 text-sm font-sans font-bold text-[#1D4E89] placeholder:text-[#1D4E89]/30 outline-none transition-all duration-300 focus:border-[#1D4E89] rounded-2xl";
const labelClasses = "block text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#1D4E89]/60";

export default function PostArticlePage() {
  const router = useRouter();
  const { user, hydrated, setError } = useAppStore();

  const [formData, setFormData] = useState({ title: "", content: "", tags: "" });
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

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

  if (!user || user.role !== "author") return <AccessDenied user={user} />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tags = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
      await createArticle({ ...formData, tags, userId: user!.id, coverImageFile: file });
      alert("Article posted successfully!");
      router.push("/profile?tab=Articles");
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to post article.");
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

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

          <h1 className="text-3xl font-serif font-bold text-[#1D4E89] tracking-tight mt-1">Post Article</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className={labelClasses}>Cover Image</label>
            {preview ? (
              <div className="relative group aspect-video w-full overflow-hidden border border-gray-100 rounded-2xl shadow-md">
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setFile(undefined); setPreview(""); }}
                  className="absolute inset-0 flex items-center justify-center bg-[#1D4E89]/80 opacity-0 transition-opacity group-hover:opacity-100 text-white text-[10px] font-sans font-black uppercase tracking-widest rounded-2xl cursor-pointer"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video w-full cursor-pointer border-2 border-dashed border-gray-200 bg-[#FDF9F0]/30 rounded-2xl transition-all hover:border-[#1D4E89] hover:bg-[#FDF9F0]/60 group">
                <ImageIcon className="mb-2 text-[#1D4E89]/40 group-hover:text-[#1D4E89] transition-colors" size={28} />
                <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1D4E89]/50 group-hover:text-[#1D4E89] transition-colors">Click to upload cover image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0])}
                />
              </label>
            )}
          </div>

          {/* Title & Tags */}
          <div className="space-y-5 border border-gray-100 bg-[#FDF9F0]/40 p-6 rounded-2xl">
            <InputField label="Title" value={formData.title} onChange={(v: string) => setFormData({ ...formData, title: v })} required />
            <InputField label="Tags" placeholder="Poetry, Fiction, Essay (comma separated)" value={formData.tags} onChange={(v: string) => setFormData({ ...formData, tags: v })} />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className={labelClasses}>Content</label>
            <textarea
              className="min-h-[220px] w-full resize-none border-2 border-gray-100 bg-[#FDF9F0]/40 p-5 text-sm font-sans font-bold text-[#1D4E89] placeholder:text-[#1D4E89]/30 outline-none transition-all duration-300 focus:border-[#1D4E89] focus:bg-white rounded-2xl"
              placeholder="Write your story..."
              required
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="h-14 w-full bg-[#1D4E89] text-white hover:bg-[#11325C] font-sans font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-[#1D4E89]/20 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing..." : "Publish Article"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className={labelClasses}>{label}</label>
      <input
        className={inputClasses}
        placeholder={placeholder || ""}
        {...props}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
}

function AccessDenied({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-[#FDF9F0]/60 flex items-center justify-center px-4">
      <div className="max-w-md w-full border border-gray-100 bg-white p-8 sm:p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-3xl font-serif font-bold text-[#1D4E89]">Access Restricted</h1>
        <p className="text-sm font-sans italic text-[#1D4E89]/60 mt-2 mb-6">
          {!user ? "Please sign in to post articles." : "Only accounts with 'Author' status can post."}
        </p>
        <motion.button
          onClick={() => window.history.back()}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="inline-block px-8 py-3.5 bg-[#E6693E] text-white font-sans font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg cursor-pointer hover:bg-[#d5582f]"
        >
          Go Back
        </motion.button>
      </div>
    </div>
  );
}

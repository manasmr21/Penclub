"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Image as ImageIcon } from "lucide-react";
import { createArticle } from "@/src/lib/articles-api";
import { useAppStore } from "@/src/lib/store/store";
import { extractErrorMessage } from "@/src/lib/http-client";

const inputClasses = "h-12 w-full rounded-none border border-primary/20 bg-zinc-50 px-4 text-sm font-sans text-[#0A192F] outline-none transition-all focus:border-primary focus:bg-white placeholder:text-primary/20";
const labelClasses = "block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40";

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

  if (!hydrated) return <div className="p-16 text-center font-sans text-primary/40 text-sm uppercase tracking-widest">Loading...</div>;
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
    <div className="mx-auto mt-28 mb-16 w-full max-w-xl px-4">
      <div className="relative border border-primary/10 bg-white p-6 sm:p-10 shadow-sm">

        {/* Close button */}
        <button
          onClick={() => router.back()}
          className="absolute right-5 top-5 h-8 w-8 flex items-center justify-center border border-primary/20 text-primary/40 hover:text-primary hover:border-primary transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        <h1 className="mb-8 text-center text-2xl font-serif font-bold text-[#0A192F]">Post Article</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Cover Image */}
          <div className="space-y-2">
            <label className={labelClasses}>Cover Image</label>
            {preview ? (
              <div className="relative group aspect-video w-full overflow-hidden border border-primary/10">
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setFile(undefined); setPreview(""); }}
                  className="absolute inset-0 flex items-center justify-center bg-[#0A192F]/60 opacity-0 transition-opacity group-hover:opacity-100 text-white text-[10px] font-sans font-bold uppercase tracking-widest"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video w-full cursor-pointer border border-dashed border-primary/20 bg-zinc-50 transition-all hover:border-primary hover:text-primary group">
                <ImageIcon className="mb-2 text-primary/30 group-hover:text-primary transition-colors" size={28} />
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">Click to upload cover image</span>
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
          <div className="space-y-5 border border-primary/10 bg-zinc-50/50 p-5">
            <InputField label="Title" value={formData.title} onChange={(v: string) => setFormData({...formData, title: v})} required />
            <InputField label="Tags" placeholder="Poetry, Fiction, Essay (comma separated)" value={formData.tags} onChange={(v: string) => setFormData({...formData, tags: v})} />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className={labelClasses}>Content</label>
            <textarea
              className="min-h-[200px] w-full resize-none rounded-none border border-primary/20 bg-zinc-50 p-4 text-sm font-serif italic text-[#0A192F]/80 outline-none transition-all focus:border-primary focus:bg-white placeholder:text-primary/20"
              placeholder="Write your story..."
              required
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <button
            disabled={loading}
            className="h-12 w-full rounded-none bg-[#0A192F] font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Publishing..." : "Publish Article"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, ...props }: any) {
  return (
    <div className="space-y-2">
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
    <div className="max-w-2xl mx-auto mt-28 px-4 text-center">
      <h1 className="text-2xl font-serif font-bold text-[#0A192F]">Access Restricted</h1>
      <p className="text-sm font-sans italic text-primary/60 mt-3">
        {!user ? "Please sign in to post articles." : "Only accounts with 'Author' status can post."}
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-6 h-10 px-6 rounded-none border border-primary/20 text-[10px] font-sans font-bold uppercase tracking-widest text-primary/60 hover:border-primary hover:text-primary transition-all cursor-pointer"
      >
        Go Back
      </button>
    </div>
  );
}

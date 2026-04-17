"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Image as ImageIcon } from "lucide-react";
import { createArticle } from "@/src/lib/articles-api";
import { useAppStore } from "@/src/lib/store/store";
import { extractErrorMessage } from "@/src/lib/http-client";

const inputClasses = "w-full rounded-xl border border-[var(--border)] bg-[#f3f4f6] px-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]";
const labelClasses = "ml-1 block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]";

export default function PostArticlePage() {
  const router = useRouter();
  const { user, hydrated, setError } = useAppStore();
  
  const [formData, setFormData] = useState({ title: "", content: "", tags: "" });
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string>(""); // State for preview URL
  const [loading, setLoading] = useState(false);

  // Clean up memory when component unmounts or file changes
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!hydrated) return <div className="p-16 text-center">Loading...</div>;
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
    // Increased mt-20 to mt-28 for more top space
    <div className="mx-auto mt-28 mb-16 w-full max-w-xl px-4">
      <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        
        <button onClick={() => router.back()} className="absolute right-4 top-4 p-2 text-[var(--muted-foreground)]">
          <X size={20} />
        </button>

        <h1 className="mb-6 text-center text-2xl font-extrabold">Post Article</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cover Image Preview & Input */}
          <div className="space-y-2">
            <label className={labelClasses}>Cover Image</label>
            {preview ? (
              <div className="relative group aspect-video w-full overflow-hidden rounded-xl border border-[var(--border)]">
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                <button 
                  type="button"
                  onClick={() => { setFile(undefined); setPreview(""); }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100 text-white font-medium"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video w-full cursor-pointer rounded-xl border-2 border-dashed border-[var(--border)] bg-[#f3f4f6] transition hover:bg-[var(--border)]/20">
                <ImageIcon className="mb-2 text-[var(--muted-foreground)]" size={32} />
                <span className="text-xs text-[var(--muted-foreground)] font-medium">Click to upload cover image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0])}
                />
              </label>
            )}
          </div>

          <div className="space-y-4 rounded-2xl border border-[var(--border)] p-4 bg-white/50">
            <InputField label="Title" value={formData.title} onChange={v => setFormData({...formData, title: v})} required />
            <InputField label="Tags (Comma separated)" value={formData.tags} onChange={v => setFormData({...formData, tags: v})} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Content</label>
            <textarea 
              className={`${inputClasses} min-h-[160px] py-3`} 
              placeholder="Write your story..."
              required 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[var(--primary)] font-semibold text-white hover:opacity-90 disabled:opacity-50 shadow-md"
          >
            {loading ? "Posting..." : "Publish Article"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className={labelClasses}>{label}</label>
      <input className={`h-11 ${inputClasses}`} {...props} onChange={e => props.onChange(e.target.value)} />
    </div>
  );
}

function AccessDenied({ user }: { user: any }) {
  return (
    <div className="max-w-2xl mx-auto mt-28 px-4 text-center">
      <h1 className="text-2xl font-bold">Access Restricted</h1>
      <p className="text-[var(--muted-foreground)] mt-2">
        {!user ? "Please sign in to post articles." : "Only accounts with 'Author' status can post."}
      </p>
      <button onClick={() => window.history.back()} className="mt-4 text-[var(--primary)] font-medium underline">Go Back</button>
    </div>
  );
}

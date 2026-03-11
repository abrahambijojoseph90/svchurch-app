"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Save,
  Send,
  Loader2,
  Upload,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg h-[400px] flex items-center justify-center text-gray-400">
      Loading editor...
    </div>
  ),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function WritePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [draftId, setDraftId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save every 30 seconds if there's content
  const autoSave = useCallback(async () => {
    if (!title || !content || !session) return;

    try {
      setAutoSaveStatus("Saving...");
      const endpoint = draftId ? `/api/user/blogs/${draftId}` : "/api/user/blogs";
      const method = draftId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slugify(title),
          content,
          excerpt,
          image,
          status: "DRAFT",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (!draftId) setDraftId(data.id);
        setAutoSaveStatus("Draft saved");
        setTimeout(() => setAutoSaveStatus(""), 3000);
      }
    } catch {
      setAutoSaveStatus("");
    }
  }, [title, content, excerpt, image, session, draftId]);

  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (title && content) {
      autoSaveTimerRef.current = setTimeout(autoSave, 30000);
    }
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [title, content, excerpt, image, autoSave]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ab815a]" />
      </main>
    );
  }

  if (!session) {
    router.push("/sign-in?callbackUrl=/write");
    return null;
  }

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(slugify(value));
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setImage(data.url);
      } else {
        setError(data.error || "Image upload failed");
      }
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      setError("Please add a title before saving.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = draftId ? `/api/user/blogs/${draftId}` : "/api/user/blogs";
      const method = draftId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slugify(title),
          content,
          excerpt,
          image,
          status: "DRAFT",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save draft");
      }

      const data = await res.json();
      if (!draftId) setDraftId(data.id);
      setSuccess("Draft saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required to submit for review.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // First save/create the post
      const endpoint = draftId ? `/api/user/blogs/${draftId}` : "/api/user/blogs";
      const method = draftId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slugify(title),
          content,
          excerpt,
          image,
          status: "PENDING_REVIEW",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSuccess("Your post has been submitted for review! Our team will review it shortly.");
      setTimeout(() => router.push("/my-posts"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 md:py-32 flex items-center justify-center bg-[#1e232b]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/90 to-[#1e232b]/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.25em] uppercase text-sm font-medium mb-4">
            Share Your Story
          </p>
          <h1 className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
            Write a Blog Post
          </h1>
          <div className="w-16 h-[2px] bg-[#ab815a] mx-auto" />
        </div>
      </section>

      {/* Editor Section */}
      <section className="bg-[#faf8f5] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {autoSaveStatus && (
                <span className="text-xs text-gray-400">{autoSaveStatus}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {showPreview ? (
            /* Preview Mode */
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
              {image && (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
                  <Image src={image} alt={title} fill className="object-cover" />
                </div>
              )}
              <h1 className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl text-[#1e232b] leading-tight mb-4">
                {title || "Untitled Post"}
              </h1>
              {excerpt && (
                <p className="text-[#1e232b]/60 text-lg mb-8 italic">{excerpt}</p>
              )}
              <div
                className="prose prose-lg max-w-none text-[#1e232b]/80"
                dangerouslySetInnerHTML={{ __html: content || "<p>Start writing to see your preview...</p>" }}
              />
            </div>
          ) : (
            /* Edit Mode */
            <div className="space-y-6">
              {/* Title */}
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Your blog post title..."
                  className="w-full text-3xl sm:text-4xl font-[family-name:var(--font-gilda)] text-[#1e232b] bg-transparent border-none outline-none placeholder:text-gray-300"
                />
                {slug && (
                  <p className="text-xs text-gray-400 mt-2">
                    svchurch.co.uk/blogs/{slug}
                  </p>
                )}
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                {image ? (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 group">
                    <Image src={image} alt="Featured" fill className="object-cover" />
                    <button
                      onClick={() => setImage("")}
                      className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturedImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-[#ab815a] hover:text-[#ab815a] transition-colors"
                    >
                      {uploadingImage ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : (
                        <Upload size={24} />
                      )}
                      <span className="text-sm">
                        {uploadingImage ? "Uploading..." : "Click to upload a featured image"}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt <span className="text-gray-400 font-normal">(brief summary)</span>
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="A short summary of your post that appears on the blog listing..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none resize-none text-gray-700"
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Share your thoughts, testimony, or reflection..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveDraft}
                  disabled={saving || submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save Draft"}
                </button>

                <button
                  onClick={handleSubmitForReview}
                  disabled={saving || submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ab815a] text-white font-medium hover:bg-[#96704d] transition-colors disabled:opacity-50 shadow-md"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitting ? "Submitting..." : "Submit for Review"}
                </button>
              </div>

              <p className="text-xs text-gray-400">
                Your post will be reviewed by our team before it&apos;s published on the blog.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

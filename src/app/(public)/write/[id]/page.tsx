"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  Send,
  Loader2,
  Upload,
  X,
  Eye,
  EyeOff,
  ArrowLeft,
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

export default function EditDraftPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [postStatus, setPostStatus] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load existing post
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch(`/api/user/blogs/${postId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((post) => {
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || "");
        setImage(post.image || "");
        setPostStatus(post.status);
        setReviewNote(post.reviewNote || "");
      })
      .catch(() => {
        setError("Could not load this post. It may not exist or you may not have access.");
      })
      .finally(() => setLoadingPost(false));
  }, [postId, status]);

  // Auto-save
  const autoSave = useCallback(async () => {
    if (!title || !content || postStatus !== "DRAFT") return;
    try {
      setAutoSaveStatus("Saving...");
      const res = await fetch(`/api/user/blogs/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content, excerpt, image, status: "DRAFT" }),
      });
      if (res.ok) {
        setAutoSaveStatus("Draft saved");
        setTimeout(() => setAutoSaveStatus(""), 3000);
      }
    } catch {
      setAutoSaveStatus("");
    }
  }, [title, slug, content, excerpt, image, postId, postStatus]);

  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (title && content && postStatus === "DRAFT") {
      autoSaveTimerRef.current = setTimeout(autoSave, 30000);
    }
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [title, content, excerpt, image, autoSave, postStatus]);

  if (status === "loading" || loadingPost) {
    return (
      <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ab815a]" />
      </main>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  const canEdit = postStatus === "DRAFT" || postStatus === "REJECTED";

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
      if (res.ok && data.url) setImage(data.url);
      else setError(data.error || "Image upload failed");
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) { setError("Please add a title."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/user/blogs/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content, excerpt, image, status: "DRAFT" }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error); }
      setPostStatus("DRAFT");
      setSuccess("Draft saved!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setSaving(false); }
  };

  const handleSubmitForReview = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/user/blogs/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content, excerpt, image, status: "PENDING_REVIEW" }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error); }
      setSuccess("Submitted for review!");
      setTimeout(() => router.push("/my-posts"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setSubmitting(false); }
  };

  return (
    <main className="overflow-x-hidden">
      <section className="relative py-24 md:py-32 flex items-center justify-center bg-[#1e232b]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/90 to-[#1e232b]/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.25em] uppercase text-sm font-medium mb-4">
            {canEdit ? "Edit Your Post" : "Viewing Post"}
          </p>
          <h1 className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
            {title || "Untitled Post"}
          </h1>
          <div className="w-16 h-[2px] bg-[#ab815a] mx-auto" />
        </div>
      </section>

      <section className="bg-[#faf8f5] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/my-posts"
              className="inline-flex items-center gap-2 text-[#ab815a] font-medium text-sm hover:text-[#f16923] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to My Posts
            </Link>
            <div className="flex items-center gap-3">
              {autoSaveStatus && <span className="text-xs text-gray-400">{autoSaveStatus}</span>}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>
          </div>

          {/* Rejection Note */}
          {postStatus === "REJECTED" && reviewNote && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-800 text-sm mb-1">Review Feedback:</p>
              <p className="text-amber-700 text-sm">{reviewNote}</p>
              <p className="text-amber-600 text-xs mt-2">
                You can edit your post and resubmit it for review.
              </p>
            </div>
          )}

          {!canEdit && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
              This post is currently {postStatus === "PENDING_REVIEW" ? "pending review" : postStatus.toLowerCase().replace("_", " ")} and cannot be edited.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>
          )}

          {showPreview ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
              {image && (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
                  <Image src={image} alt={title} fill className="object-cover" />
                </div>
              )}
              <h1 className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl text-[#1e232b] leading-tight mb-4">
                {title || "Untitled Post"}
              </h1>
              {excerpt && <p className="text-[#1e232b]/60 text-lg mb-8 italic">{excerpt}</p>}
              <div
                className="prose prose-lg max-w-none text-[#1e232b]/80"
                dangerouslySetInnerHTML={{ __html: content || "<p>No content yet.</p>" }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Your blog post title..."
                  disabled={!canEdit}
                  className="w-full text-3xl sm:text-4xl font-[family-name:var(--font-gilda)] text-[#1e232b] bg-transparent border-none outline-none placeholder:text-gray-300 disabled:opacity-60"
                />
                {slug && <p className="text-xs text-gray-400 mt-2">svchurch.co.uk/blogs/{slug}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                {image ? (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 group">
                    <Image src={image} alt="Featured" fill className="object-cover" />
                    {canEdit && (
                      <button
                        onClick={() => setImage("")}
                        className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ) : canEdit ? (
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFeaturedImageUpload} className="hidden" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-[#ab815a] hover:text-[#ab815a] transition-colors"
                    >
                      {uploadingImage ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                      <span className="text-sm">{uploadingImage ? "Uploading..." : "Click to upload"}</span>
                    </button>
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  disabled={!canEdit}
                  placeholder="A short summary..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none resize-none text-gray-700 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                {canEdit ? (
                  <RichTextEditor content={content} onChange={setContent} placeholder="Share your thoughts..." />
                ) : (
                  <div className="prose prose-sm max-w-none border border-gray-300 rounded-lg p-4 bg-gray-50 opacity-60" dangerouslySetInnerHTML={{ __html: content }} />
                )}
              </div>

              {canEdit && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving || submitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Saving..." : "Save Draft"}
                  </button>
                  <button
                    onClick={handleSubmitForReview}
                    disabled={saving || submitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ab815a] text-white font-medium hover:bg-[#96704d] transition-colors disabled:opacity-50 shadow-md"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? "Submitting..." : "Submit for Review"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

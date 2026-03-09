"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Plus,
  Save,
  X,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  Copy,
} from "lucide-react";

// Dynamic import to avoid SSR issues with TipTap
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg h-[250px] flex items-center justify-center text-gray-400">
      Loading editor...
    </div>
  ),
});

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  heroImage: string | null;
  published: boolean;
  publishedAt: string | null;
  parentSlug: string | null;
  order: number;
}

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  heroImage: "",
  published: false,
  parentSlug: "",
};

export default function AdminCustomPagesPage() {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugManuallyEdited ? prev.slug : generateSlug(title),
    }));
  };

  const handleSlugChange = (slug: string) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug }));
  };

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/custom-pages");
      if (!res.ok) throw new Error("Failed to fetch");
      setPages(await res.json());
    } catch {
      setError("Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSave = async () => {
    if (!form.title || !form.content) {
      setError("Title and content are required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const method = editingId ? "PUT" : "POST";
      const slug =
        form.slug ||
        form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const body = {
        ...(editingId ? { id: editingId } : {}),
        title: form.title,
        slug,
        content: form.content,
        excerpt: form.excerpt || null,
        heroImage: form.heroImage || null,
        published: form.published,
        parentSlug: form.parentSlug || null,
      };

      const res = await fetch("/api/admin/custom-pages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSuccess(editingId ? "Page updated!" : "Page created!");
      setTimeout(() => setSuccess(""), 3000);
      resetForm();
      fetchPages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (page: CustomPage) => {
    setEditingId(page.id);
    setShowForm(true);
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt || "",
      heroImage: page.heroImage || "",
      published: page.published,
      parentSlug: page.parentSlug || "",
    });
    setSlugManuallyEdited(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/custom-pages?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchPages();
    } catch {
      setError("Failed to delete page");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setShowPreview(false);
    setForm(emptyForm);
    setSlugManuallyEdited(false);
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setSuccess(`Link copied: /p/${slug}`);
    setTimeout(() => setSuccess(""), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#ab815a]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Custom Pages</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create pages and link them anywhere on the site using <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/p/your-slug</code>
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: "#ab815a" }}
          >
            <Plus className="w-4 h-4" />
            New Page
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* ======================== FORM ======================== */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Page" : "Create New Page"}
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="e.g. Youth Camp 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 mr-1">/p/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                    placeholder="auto-generated-from-title"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                placeholder="Brief description (for link previews and SEO)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero/Banner Image URL
                </label>
                <input
                  type="text"
                  value={form.heroImage}
                  onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="/images/example.jpg or https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Section
                </label>
                <select
                  value={form.parentSlug}
                  onChange={(e) => setForm({ ...form, parentSlug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                >
                  <option value="">None (standalone page)</option>
                  <option value="about">About</option>
                  <option value="ministries">Ministries</option>
                  <option value="media-centre">Media Centre</option>
                  <option value="blogs">Blogs</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Content <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
                placeholder="Write your page content here... Use the toolbar for headings, images, links, lists, and formatting."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 text-[#ab815a] border-gray-300 rounded focus:ring-[#ab815a]"
              />
              <label htmlFor="published" className="text-sm text-gray-700">
                Publish this page (make it visible to visitors)
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#ab815a" }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : editingId ? "Update Page" : "Create Page"}
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#ab815a] text-[#ab815a] hover:bg-[#ab815a]/5 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ======================== PREVIEW ======================== */}
      {showPreview && showForm && (
        <div className="bg-white rounded-xl border-2 border-[#ab815a]/30 overflow-hidden mb-6">
          <div className="bg-[#ab815a]/10 px-6 py-3 flex items-center justify-between border-b border-[#ab815a]/20">
            <span className="text-sm font-medium text-[#ab815a]">Page Preview</span>
            <div className="flex items-center gap-2">
              {!form.published && (
                <button
                  onClick={() => {
                    setForm({ ...form, published: true });
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium bg-[#ab815a] text-white hover:bg-[#8a6744] transition-colors"
                >
                  Publish Now
                </button>
              )}
              <span className="text-xs text-gray-500">/p/{form.slug || "..."}</span>
            </div>
          </div>

          {/* Hero preview */}
          <div className="relative bg-[#1e232b] py-16 text-center">
            {form.heroImage && (
              <div className="absolute inset-0 opacity-25">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.heroImage} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="relative z-10 px-6">
              <h1 className="font-[family-name:var(--font-gilda)] text-3xl text-white mb-2">
                {form.title || "Page Title"}
              </h1>
              {form.excerpt && (
                <p className="text-white/60 text-sm max-w-xl mx-auto">{form.excerpt}</p>
              )}
              <div className="w-12 h-[2px] bg-[#ab815a] mx-auto mt-4" />
            </div>
          </div>

          {/* Content preview */}
          <div className="px-8 py-10 bg-[#faf8f5]">
            <article
              className="prose prose-sm max-w-none text-[#1e232b]/80
                prose-headings:font-[family-name:var(--font-gilda)] prose-headings:text-[#1e232b]
                prose-a:text-[#ab815a] prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-blockquote:border-l-[#ab815a]"
              dangerouslySetInnerHTML={{ __html: form.content || "<p class='text-gray-400 italic'>Start writing to see preview...</p>" }}
            />
          </div>
        </div>
      )}

      {/* ======================== PAGE LIST ======================== */}
      {pages.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No custom pages yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: "#ab815a" }}
          >
            <Plus className="w-4 h-4" />
            Create Your First Page
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {page.title}
                  </h3>
                  {page.published ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      <Eye className="w-3 h-3" /> Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      <EyeOff className="w-3 h-3" /> Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  /p/{page.slug}
                  {page.parentSlug && (
                    <span className="ml-2 text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                      {page.parentSlug}
                    </span>
                  )}
                </p>
                {page.excerpt && (
                  <p className="text-sm text-gray-500 mt-1 truncate">{page.excerpt}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyLink(page.slug)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`/p/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-[#ab815a] transition-colors"
                  title="View page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleEdit(page)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

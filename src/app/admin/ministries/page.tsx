"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Pencil,
  Plus,
  Save,
  X,
  Loader2,
} from "lucide-react";

interface Ministry {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string;
  fullContent: string | null;
  mission: string | null;
  schedule: string | null;
  location: string | null;
  image: string | null;
  bannerImage: string | null;
  icon: string | null;
  order: number;
}

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyForm = {
    name: "",
    slug: "",
    subtitle: "",
    description: "",
    fullContent: "",
    mission: "",
    schedule: "",
    location: "",
    image: "",
    bannerImage: "",
    icon: "",
  };
  const [form, setForm] = useState(emptyForm);

  const fetchMinistries = async () => {
    try {
      const res = await fetch("/api/admin/ministries");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMinistries(data);
    } catch {
      setError("Failed to load ministries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.description) {
      setError("Name and description are required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const method = editingId ? "PUT" : "POST";
      const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const body = {
        ...(editingId ? { id: editingId } : {}),
        name: form.name,
        slug,
        subtitle: form.subtitle || null,
        description: form.description,
        fullContent: form.fullContent || null,
        mission: form.mission || null,
        schedule: form.schedule || null,
        location: form.location || null,
        image: form.image || null,
        bannerImage: form.bannerImage || null,
        icon: form.icon || null,
        order: editingId
          ? ministries.find((m) => m.id === editingId)?.order ?? 0
          : ministries.length,
      };

      const res = await fetch("/api/admin/ministries", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      resetForm();
      fetchMinistries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ministry: Ministry) => {
    setEditingId(ministry.id);
    setShowForm(true);
    setForm({
      name: ministry.name,
      slug: ministry.slug || "",
      subtitle: ministry.subtitle || "",
      description: ministry.description,
      fullContent: ministry.fullContent || "",
      mission: ministry.mission || "",
      schedule: ministry.schedule || "",
      location: ministry.location || "",
      image: ministry.image || "",
      bannerImage: ministry.bannerImage || "",
      icon: ministry.icon || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ministry?")) return;
    try {
      const res = await fetch(`/api/admin/ministries?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchMinistries();
    } catch {
      setError("Failed to delete ministry");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setForm(emptyForm);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ab815a]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ministries</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: "#ab815a" }}
            >
              <Plus className="w-4 h-4" />
              Add Ministry
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? "Edit Ministry" : "Add New Ministry"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="Ministry name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="Short subtitle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="Auto-generated from name if empty"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none resize-y"
                  placeholder="Brief description shown on the ministries listing page"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement</label>
                <textarea
                  value={form.mission}
                  onChange={(e) => setForm({ ...form, mission: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none resize-y"
                  placeholder="Ministry mission statement (shown on detail page)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Page Content
                </label>
                <textarea
                  value={form.fullContent}
                  onChange={(e) => setForm({ ...form, fullContent: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none resize-y"
                  placeholder="Detailed content for the individual ministry page. Use separate lines for paragraphs."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <input
                  type="text"
                  value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="e.g. Every Sunday at 10am"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="e.g. Main Hall"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="/images/ministries/example.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={form.bannerImage}
                  onChange={(e) => setForm({ ...form, bannerImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="Hero image for the detail page"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon Name
                </label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="e.g. Heart, BookOpen, Music"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#ab815a" }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {ministries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No ministries added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ministries.map((ministry) => (
              <div
                key={ministry.id}
                className="bg-white rounded-lg shadow p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {ministry.name}
                    </h3>
                    {ministry.subtitle && (
                      <p className="text-sm text-[#ab815a]">{ministry.subtitle}</p>
                    )}
                  </div>
                  {ministry.icon && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                      {ministry.icon}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {ministry.description}
                </p>
                <div className="text-xs text-gray-400 space-y-1 mb-4">
                  {ministry.schedule && <p>Schedule: {ministry.schedule}</p>}
                  {ministry.location && <p>Location: {ministry.location}</p>}
                </div>
                <div className="flex items-center gap-2 border-t pt-3">
                  <button
                    onClick={() => handleEdit(ministry)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ministry.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

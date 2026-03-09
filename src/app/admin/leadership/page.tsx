"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Pencil,
  Plus,
  Save,
  X,
  Loader2,
} from "lucide-react";

interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  order: number;
  socials: Record<string, string> | null;
}

export default function AdminLeadershipPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const emptyForm = { name: "", role: "", bio: "", image: "", socials: "" };
  const [form, setForm] = useState(emptyForm);

  const fetchLeaders = async () => {
    try {
      const res = await fetch("/api/admin/leadership");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLeaders(data);
    } catch {
      setError("Failed to load leaders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    let socialsJson = null;
    if (form.socials.trim()) {
      try {
        socialsJson = JSON.parse(form.socials);
      } catch {
        setError("Socials must be valid JSON (e.g. {\"facebook\": \"url\"})");
        setSaving(false);
        return;
      }
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const body = {
        ...(editingId ? { id: editingId } : {}),
        name: form.name,
        role: form.role,
        bio: form.bio || null,
        image: form.image || null,
        socials: socialsJson,
        order: editingId
          ? leaders.find((l) => l.id === editingId)?.order ?? 0
          : leaders.length,
      };

      const res = await fetch("/api/admin/leadership", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      resetForm();
      fetchLeaders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (leader: Leader) => {
    setEditingId(leader.id);
    setShowAddForm(true);
    setForm({
      name: leader.name,
      role: leader.role,
      bio: leader.bio || "",
      image: leader.image || "",
      socials: leader.socials ? JSON.stringify(leader.socials, null, 2) : "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leader?")) return;
    try {
      const res = await fetch(`/api/admin/leadership?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchLeaders();
    } catch {
      setError("Failed to delete leader");
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const idx = leaders.findIndex((l) => l.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= leaders.length) return;

    const current = leaders[idx];
    const swap = leaders[swapIdx];

    await Promise.all([
      fetch("/api/admin/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, order: swap.order }),
      }),
      fetch("/api/admin/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...swap, order: current.order }),
      }),
    ]);

    fetchLeaders();
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Leadership</h1>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: "#ab815a" }}
            >
              <Plus className="w-4 h-4" />
              Add Leader
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? "Edit Leader" : "Add New Leader"}
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
                  placeholder="Leader name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="e.g. Senior Pastor"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none resize-y"
                  placeholder="Brief biography"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Socials (JSON)
                </label>
                <input
                  type="text"
                  value={form.socials}
                  onChange={(e) => setForm({ ...form, socials: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none"
                  placeholder='{"facebook": "url", "twitter": "url"}'
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.role}
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

        {leaders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No leaders added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, idx) => (
              <div
                key={leader.id}
                className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleReorder(leader.id, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleReorder(leader.id, "down")}
                    disabled={idx === leaders.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {leader.image && (
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{leader.name}</p>
                  <p className="text-sm text-gray-500">{leader.role}</p>
                  {leader.bio && (
                    <p className="text-sm text-gray-400 mt-1 truncate">{leader.bio}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(leader)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(leader.id)}
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

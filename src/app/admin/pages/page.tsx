"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Save,
  Loader2,
  CheckCircle,
  Home,
  Info,
  Phone,
  BookOpen,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Page definitions — each page has editable sections                 */
/* ------------------------------------------------------------------ */

const pageDefinitions = [
  {
    slug: "home",
    label: "Homepage",
    icon: Home,
    sections: [
      { key: "hero_title", label: "Hero Title", type: "text" as const },
      { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" as const },
      { key: "welcome_heading", label: "Welcome Heading", type: "text" as const },
      { key: "welcome_text", label: "Welcome Text", type: "textarea" as const },
      { key: "cta_heading", label: "CTA Banner Heading", type: "text" as const },
      { key: "cta_text", label: "CTA Banner Text", type: "textarea" as const },
    ],
  },
  {
    slug: "about",
    label: "About",
    icon: Info,
    sections: [
      { key: "hero_title", label: "Hero Title", type: "text" as const },
      { key: "story_heading", label: "Our Story Heading", type: "text" as const },
      { key: "story_text", label: "Our Story Content", type: "textarea" as const },
      { key: "mission_heading", label: "Mission Heading", type: "text" as const },
      { key: "mission_text", label: "Mission Statement", type: "textarea" as const },
      { key: "vision_heading", label: "Vision Heading", type: "text" as const },
      { key: "vision_text", label: "Vision Statement", type: "textarea" as const },
    ],
  },
  {
    slug: "contact",
    label: "Contact",
    icon: Phone,
    sections: [
      { key: "hero_title", label: "Hero Title", type: "text" as const },
      { key: "intro_text", label: "Intro Text", type: "textarea" as const },
      { key: "address", label: "Church Address", type: "textarea" as const },
      { key: "phone", label: "Phone Number", type: "text" as const },
      { key: "email", label: "Email Address", type: "text" as const },
      { key: "map_embed_url", label: "Google Maps Embed URL", type: "text" as const },
    ],
  },
  {
    slug: "media-centre",
    label: "Media Centre",
    icon: BookOpen,
    sections: [
      { key: "hero_title", label: "Hero Title", type: "text" as const },
      { key: "intro_text", label: "Intro Text", type: "textarea" as const },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminPagesPage() {
  const [activePage, setActivePage] = useState(pageDefinitions[0].slug);
  const [allContent, setAllContent] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/pages")
      .then((res) => res.json())
      .then((data) => setAllContent(data))
      .catch(() => setError("Failed to load page content"))
      .finally(() => setLoading(false));
  }, []);

  const currentDef = pageDefinitions.find((p) => p.slug === activePage)!;
  const currentContent = allContent[activePage] || {};

  const updateField = (section: string, value: string) => {
    setAllContent((prev) => ({
      ...prev,
      [activePage]: {
        ...(prev[activePage] || {}),
        [section]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const sections = allContent[activePage] || {};
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSlug: activePage, sections }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSuccess(`${currentDef.label} page saved successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Page Content</h2>

      {/* Page tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pageDefinitions.map((page) => {
          const Icon = page.icon;
          const isActive = activePage === page.slug;
          return (
            <button
              key={page.slug}
              onClick={() => {
                setActivePage(page.slug);
                setError("");
                setSuccess("");
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-[#ab815a] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {page.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Section fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {currentDef.label}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Edit the content sections for the {currentDef.label} page. Changes will appear on the live site.
        </p>

        <div className="space-y-5">
          {currentDef.sections.map((section) => (
            <div key={section.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {section.label}
              </label>
              {section.type === "textarea" ? (
                <textarea
                  value={currentContent[section.key] || ""}
                  onChange={(e) => updateField(section.key, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none resize-y text-sm"
                  placeholder={`Enter ${section.label.toLowerCase()}...`}
                />
              ) : (
                <input
                  type="text"
                  value={currentContent[section.key] || ""}
                  onChange={(e) => updateField(section.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none text-sm"
                  placeholder={`Enter ${section.label.toLowerCase()}...`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#ab815a" }}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

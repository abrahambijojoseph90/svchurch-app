"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react";

export default function EditProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setBio(data.bio || "");
        setAvatar(data.avatar || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) setAvatar(data.url);
      else setError(data.error || "Upload failed");
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, avatar }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      // Update session with new name
      await update({ name });
      setSuccess("Profile updated successfully!");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="overflow-x-hidden">
      <section className="relative py-24 md:py-32 flex items-center justify-center bg-[#1e232b]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/90 to-[#1e232b]/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.25em] uppercase text-sm font-medium mb-4">
            Settings
          </p>
          <h1 className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
            Edit Profile
          </h1>
          <div className="w-16 h-[2px] bg-[#ab815a] mx-auto" />
        </div>
      </section>

      <section className="bg-[#faf8f5] py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-[#ab815a] font-medium text-sm hover:text-[#f16923] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>
          )}

          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-[#ab815a]/10 flex items-center justify-center flex-shrink-0">
                  {avatar ? (
                    <Image src={avatar} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-2xl font-bold text-[#ab815a]">
                      {name.charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                  {avatar && (
                    <button
                      onClick={() => setAvatar("")}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <X size={14} />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none text-gray-700"
                placeholder="Your name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none resize-none text-gray-700"
                placeholder="Tell us a bit about yourself..."
              />
              <p className="text-xs text-gray-400 mt-1">{bio.length}/500 characters</p>
            </div>

            {/* Save */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ab815a] text-white font-medium hover:bg-[#96704d] transition-colors disabled:opacity-50 shadow-md"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

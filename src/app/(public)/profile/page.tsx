"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, FileText, Loader2, Calendar, Plus } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  postCount: number;
  publishedCount: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then(setProfile)
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
    router.push("/sign-in?callbackUrl=/profile");
    return null;
  }

  return (
    <main className="overflow-x-hidden">
      <section className="relative py-24 md:py-32 flex items-center justify-center bg-[#1e232b]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/90 to-[#1e232b]/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.25em] uppercase text-sm font-medium mb-4">
            Profile
          </p>
          <h1 className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
            {session.user?.name || "Your Profile"}
          </h1>
          <div className="w-16 h-[2px] bg-[#ab815a] mx-auto" />
        </div>
      </section>

      <section className="bg-[#faf8f5] py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          {profile && (
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#ab815a]/10 flex items-center justify-center flex-shrink-0">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-[#ab815a]">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
                  {profile.bio && (
                    <p className="text-gray-600 mt-3">{profile.bio}</p>
                  )}
                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} />
                      Joined {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                >
                  <Pencil size={14} />
                  Edit Profile
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <p className="text-3xl font-bold text-[#ab815a]">{profile.postCount}</p>
                  <p className="text-sm text-gray-500 mt-1">Total Posts</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <p className="text-3xl font-bold text-green-600">{profile.publishedCount}</p>
                  <p className="text-sm text-gray-500 mt-1">Published</p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/my-posts"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <FileText size={18} />
                  View My Posts
                </Link>
                <Link
                  href="/write"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ab815a] text-white font-medium hover:bg-[#96704d] transition-colors shadow-md"
                >
                  <Plus size={18} />
                  Write New Post
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

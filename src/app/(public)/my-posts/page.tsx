"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Send,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  status: string;
  reviewNote: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  DRAFT: {
    label: "Draft",
    color: "bg-gray-100 text-gray-700",
    icon: <FileText size={14} />,
  },
  PENDING_REVIEW: {
    label: "Pending Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Clock size={14} />,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-blue-100 text-blue-800",
    icon: <CheckCircle size={14} />,
  },
  PUBLISHED: {
    label: "Published",
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle size={14} />,
  },
  REJECTED: {
    label: "Needs Changes",
    color: "bg-red-100 text-red-800",
    icon: <XCircle size={14} />,
  },
};

export default function MyPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/blogs")
      .then((res) => res.json())
      .then(setPosts)
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
    router.push("/sign-in?callbackUrl=/my-posts");
    return null;
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/user/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  const filteredPosts = filter === "ALL" ? posts : posts.filter((p) => p.status === filter);

  const counts = {
    ALL: posts.length,
    DRAFT: posts.filter((p) => p.status === "DRAFT").length,
    PENDING_REVIEW: posts.filter((p) => p.status === "PENDING_REVIEW").length,
    PUBLISHED: posts.filter((p) => p.status === "PUBLISHED").length,
    REJECTED: posts.filter((p) => p.status === "REJECTED").length,
  };

  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 md:py-32 flex items-center justify-center bg-[#1e232b]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/90 to-[#1e232b]/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.25em] uppercase text-sm font-medium mb-4">
            Your Dashboard
          </p>
          <h1 className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
            My Blog Posts
          </h1>
          <div className="w-16 h-[2px] bg-[#ab815a] mx-auto" />
        </div>
      </section>

      {/* Content */}
      <section className="bg-[#faf8f5] py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header with action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Welcome, {session.user?.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage your blog posts and drafts
              </p>
            </div>
            <Link
              href="/write"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ab815a] text-white font-medium hover:bg-[#96704d] transition-colors shadow-md"
            >
              <Plus size={18} />
              Write New Post
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(["ALL", "DRAFT", "PENDING_REVIEW", "PUBLISHED", "REJECTED"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-[#ab815a] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {key === "ALL" ? "All" : STATUS_CONFIG[key]?.label || key}{" "}
                <span className="ml-1 opacity-70">({counts[key]})</span>
              </button>
            ))}
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {filter === "ALL" ? "No posts yet" : `No ${STATUS_CONFIG[filter]?.label || filter} posts`}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {filter === "ALL"
                  ? "Start writing your first blog post and share it with the church community."
                  : "Posts with this status will appear here."}
              </p>
              {filter === "ALL" && (
                <Link
                  href="/write"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ab815a] text-white font-medium hover:bg-[#96704d] transition-colors"
                >
                  <Plus size={18} />
                  Write Your First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const config = STATUS_CONFIG[post.status] || STATUS_CONFIG.DRAFT;
                const canEdit = post.status === "DRAFT" || post.status === "REJECTED";

                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {post.title}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                            {config.icon}
                            {config.label}
                          </span>
                        </div>
                        {post.excerpt && (
                          <p className="text-sm text-gray-500 truncate mb-1">
                            {post.excerpt}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          {post.status === "PUBLISHED" && post.publishedAt
                            ? `Published ${new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                            : `Last updated ${new Date(post.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
                        </p>

                        {/* Rejection feedback */}
                        {post.status === "REJECTED" && post.reviewNote && (
                          <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-700">
                            <span className="font-medium">Feedback:</span> {post.reviewNote}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {post.status === "PUBLISHED" && (
                          <Link
                            href={`/blogs/${post.slug}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <Eye size={14} />
                            View
                          </Link>
                        )}
                        {canEdit && (
                          <>
                            <Link
                              href={`/write/${post.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(post.id)}
                              disabled={deleting === post.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {deleting === post.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              Delete
                            </button>
                          </>
                        )}
                        {post.status === "PENDING_REVIEW" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-yellow-700 bg-yellow-50 rounded-lg">
                            <Send size={14} />
                            Under Review
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

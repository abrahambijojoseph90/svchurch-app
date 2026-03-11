"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Clock,
  Send,
  User,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  author: { name: string };
}

export default function AdminReviewPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const all = await res.json();
        setPosts(all.filter((p: Post) => p.status === "PENDING_REVIEW"));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAction = async (postId: string, action: "approve" | "reject" | "publish") => {
    if (action === "reject" && !reviewNote.trim()) {
      setError("Please provide feedback when rejecting a post.");
      return;
    }
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/blogs/${postId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: reviewNote || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }

      const actionLabel = action === "approve" ? "approved" : action === "reject" ? "rejected" : "published";
      setSuccess(`Post ${actionLabel} successfully!`);
      setSelectedPost(null);
      setReviewNote("");
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setProcessing(false);
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog Posts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Pending Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">
            {posts.length} post{posts.length !== 1 ? "s" : ""} waiting for review
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">All caught up!</h3>
          <p className="text-gray-500 text-sm">No posts are waiting for review.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock size={12} />
                        Pending Review
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{post.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="inline-flex items-center gap-1">
                        <User size={14} />
                        {post.author.name}
                      </span>
                      <span>
                        Submitted {new Date(post.updatedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                    )}
                  </div>
                </div>

                {/* Preview / Review Actions */}
                {selectedPost?.id === post.id ? (
                  <div className="mt-4">
                    {/* Content Preview */}
                    <div className="border border-gray-200 rounded-lg p-6 mb-4 max-h-96 overflow-y-auto bg-gray-50">
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>

                    {/* Review Note */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Review Note <span className="text-gray-400">(required for rejection)</span>
                      </label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        rows={3}
                        placeholder="Add feedback for the author..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab815a] focus:border-transparent outline-none resize-none text-sm"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAction(post.id, "publish")}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                      >
                        {processing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => handleAction(post.id, "approve")}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                      >
                        {processing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(post.id, "reject")}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                      >
                        {processing ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                        Request Changes
                      </button>
                      <button
                        onClick={() => { setSelectedPost(null); setReviewNote(""); }}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="inline-flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-[#ab815a] text-white font-medium hover:bg-[#96704d] transition-colors"
                    >
                      <Eye size={14} />
                      Review Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

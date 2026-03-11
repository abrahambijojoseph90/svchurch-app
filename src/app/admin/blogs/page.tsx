import Link from "next/link";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Trash2, Pencil, Plus, Clock, Eye } from "lucide-react";

async function deleteBlogPost(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blogs");
}

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-700" },
  PENDING_REVIEW: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "Approved", color: "bg-blue-100 text-blue-800" },
  PUBLISHED: { label: "Published", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

export default async function AdminBlogsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const pendingCount = posts.filter((p) => p.status === "PENDING_REVIEW").length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-sm text-gray-500 mt-1">{posts.length} total posts</p>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <Link
                href="/admin/blogs/review"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-yellow-400 text-yellow-700 font-medium hover:bg-yellow-50 transition-colors"
              >
                <Clock className="w-4 h-4" />
                Review Posts
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              </Link>
            )}
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: "#ab815a" }}
            >
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No blog posts yet. Create your first post!
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                    Author
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => {
                  const badge = STATUS_BADGE[post.status] || STATUS_BADGE.DRAFT;
                  return (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{post.title}</span>
                        <p className="text-sm text-gray-500 mt-0.5">/blogs/{post.slug}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{post.author.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {post.status === "PENDING_REVIEW" && (
                            <Link
                              href="/admin/blogs/review"
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Review
                            </Link>
                          )}
                          <Link
                            href={`/admin/blogs/${post.id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </Link>
                          <form action={deleteBlogPost}>
                            <input type="hidden" name="id" value={post.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

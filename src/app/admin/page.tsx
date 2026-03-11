import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  FileText,
  Users,
  Heart,
  ImageIcon,
  Mail,
  Video,
  Clock,
  User,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [blogCount, leaderCount, ministryCount, galleryCount, messageCount, mediaCount, pendingReviewCount, pendingPosts] =
    await Promise.all([
      prisma.blogPost.count(),
      prisma.leader.count(),
      prisma.ministry.count(),
      prisma.galleryImage.count(),
      prisma.contactSubmission.count({ where: { read: false } }),
      prisma.sermonMedia.count(),
      prisma.blogPost.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.blogPost.findMany({
        where: { status: "PENDING_REVIEW" },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { author: { select: { name: true } } },
      }),
    ]);

  const cards = [
    {
      label: "Blog Posts",
      count: blogCount,
      icon: FileText,
      href: "/admin/blogs",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Leaders",
      count: leaderCount,
      icon: Users,
      href: "/admin/leadership",
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Ministries",
      count: ministryCount,
      icon: Heart,
      href: "/admin/ministries",
      color: "bg-pink-50 text-pink-600",
    },
    {
      label: "Gallery Images",
      count: galleryCount,
      icon: ImageIcon,
      href: "/admin/gallery",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Unread Messages",
      count: messageCount,
      icon: Mail,
      href: "/admin/messages",
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Media Items",
      count: mediaCount,
      icon: Video,
      href: "/admin/media",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {/* Pending Reviews Alert */}
      {pendingReviewCount > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900">
                  {pendingReviewCount} Post{pendingReviewCount !== 1 ? "s" : ""} Pending Review
                </h3>
                <p className="text-sm text-yellow-700">
                  Community members have submitted blog posts for your review.
                </p>
              </div>
            </div>
            <Link
              href="/admin/blogs/review"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-colors text-sm"
            >
              Review Now
            </Link>
          </div>
          <div className="space-y-2">
            {pendingPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between py-2 px-3 bg-white/60 rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-gray-900 text-sm truncate">
                    {post.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
                  <User className="w-3 h-3" />
                  {post.author.name}
                  <span className="text-gray-300">|</span>
                  {new Date(post.updatedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.count}
                  </p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

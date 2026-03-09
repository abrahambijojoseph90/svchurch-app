import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  FileText,
  Users,
  Heart,
  ImageIcon,
  Mail,
  Video,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [blogCount, leaderCount, ministryCount, galleryCount, messageCount, mediaCount] =
    await Promise.all([
      prisma.blogPost.count(),
      prisma.leader.count(),
      prisma.ministry.count(),
      prisma.galleryImage.count(),
      prisma.contactSubmission.count({ where: { read: false } }),
      prisma.sermonMedia.count(),
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

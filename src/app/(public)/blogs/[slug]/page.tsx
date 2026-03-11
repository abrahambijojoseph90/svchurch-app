import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
    include: { author: { select: { name: true, avatar: true, bio: true } } },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="overflow-x-hidden">
      {/* ======================== HERO ======================== */}
      <section className="relative py-32 md:py-40 flex items-center justify-center bg-[#1e232b]">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover opacity-30"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/80 to-[#1e232b]/90" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.25em] uppercase text-sm font-medium mb-6">
            Blog
          </p>

          <h1 className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
            <span className="inline-flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author.name}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                "en-GB",
                { day: "numeric", month: "long", year: "numeric" }
              )}
            </span>
          </div>

          <div className="w-16 h-[2px] bg-[#ab815a] mx-auto mt-8" />
        </div>
      </section>

      {/* ======================== CONTENT ======================== */}
      <section className="bg-[#faf8f5] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-[#ab815a] font-medium text-sm hover:text-[#f16923] transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>

          {/* Featured image */}
          {post.image && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-lg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Author card */}
          <div className="flex items-center gap-4 mb-10 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#ab815a]/10 flex items-center justify-center flex-shrink-0">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-lg font-bold text-[#ab815a]">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-[#1e232b]">{post.author.name}</p>
              {post.author.bio && (
                <p className="text-sm text-gray-500 line-clamp-1">{post.author.bio}</p>
              )}
            </div>
          </div>

          {/* Article content */}
          <article
            className="prose prose-lg max-w-none text-[#1e232b]/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Divider */}
          <div className="mt-16 pt-10 border-t border-[#ab815a]/20">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-[#ab815a] font-medium hover:text-[#f16923] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              View All Blogs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

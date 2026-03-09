import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      include: { author: { select: { name: true } } },
    });

    const formatted = posts.map((post) => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      image: post.image,
      publishedAt: post.publishedAt?.toISOString() || null,
      authorName: post.author.name,
    }));

    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json([]);
  }
}

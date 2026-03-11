import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/security";

// GET /api/user/blogs — list the current user's blog posts
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const posts = await prisma.blogPost.findMany({
    where: { authorId: userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      image: true,
      status: true,
      published: true,
      publishedAt: true,
      reviewNote: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(posts);
}

// POST /api/user/blogs — create a new blog post as the current user
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, slug, content, excerpt, image, status } = body as {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    image?: string;
    status?: string;
  };

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Sanitize slug
  const safeSlug = (slug || title)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!safeSlug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  // Check slug uniqueness
  const existing = await prisma.blogPost.findUnique({ where: { slug: safeSlug } });
  if (existing) {
    // Append a random suffix
    const uniqueSlug = `${safeSlug}-${Date.now().toString(36)}`;
    const post = await prisma.blogPost.create({
      data: {
        title: sanitizeHtml(title),
        slug: uniqueSlug,
        content: content || "",
        authorId: userId,
        excerpt: excerpt ? sanitizeHtml(excerpt) : null,
        image: image || null,
        status: status === "PENDING_REVIEW" ? "PENDING_REVIEW" : "DRAFT",
        published: false,
      },
    });
    return NextResponse.json(post, { status: 201 });
  }

  const post = await prisma.blogPost.create({
    data: {
      title: sanitizeHtml(title),
      slug: safeSlug,
      content: content || "",
      authorId: userId,
      excerpt: excerpt ? sanitizeHtml(excerpt) : null,
      image: image || null,
      status: status === "PENDING_REVIEW" ? "PENDING_REVIEW" : "DRAFT",
      published: false,
    },
  });

  return NextResponse.json(post, { status: 201 });
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePermission, logAuditEvent } from "@/lib/api-auth";
import { sanitizeHtml } from "@/lib/security";

export async function GET() {
  const auth = await requirePermission("create_posts");
  if (auth instanceof NextResponse) return auth;

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const auth = await requirePermission("create_posts");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, slug, content, excerpt, image, published } = body as {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    image?: string;
    published?: boolean;
  };

  if (!title || !slug || !content) {
    return NextResponse.json(
      { error: "Title, slug, and content are required" },
      { status: 400 }
    );
  }

  // Sanitize slug: allow only lowercase alphanumeric, hyphens
  const safeSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!safeSlug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  // If user is trying to publish, check publish permission
  if (published) {
    const pubAuth = await requirePermission("publish_posts");
    if (pubAuth instanceof NextResponse) return pubAuth;
  }

  const post = await prisma.blogPost.create({
    data: {
      title: sanitizeHtml(title),
      slug: safeSlug,
      content,
      authorId: auth.user.id,
      excerpt: excerpt ? sanitizeHtml(excerpt) : null,
      image: image || null,
      published: published || false,
      publishedAt: published ? new Date() : null,
      status: published ? "PUBLISHED" : "DRAFT",
    },
  });

  await logAuditEvent(auth.user.id, "CREATE_POST", `BlogPost:${post.id}`);

  return NextResponse.json(post, { status: 201 });
}

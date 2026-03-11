import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/security";

// GET /api/user/blogs/[id] — get a single post owned by the current user
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const post = await prisma.blogPost.findFirst({
    where: { id: params.id, authorId: userId },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// PUT /api/user/blogs/[id] — update a post owned by the current user
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  // Verify ownership
  const existing = await prisma.blogPost.findFirst({
    where: { id: params.id, authorId: userId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Only allow editing DRAFT or REJECTED posts
  if (existing.status !== "DRAFT" && existing.status !== "REJECTED") {
    return NextResponse.json(
      { error: "This post cannot be edited in its current status" },
      { status: 403 }
    );
  }

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

  // Sanitize slug if provided
  let safeSlug = existing.slug;
  if (slug && slug !== existing.slug) {
    safeSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Check uniqueness
    const slugTaken = await prisma.blogPost.findFirst({
      where: { slug: safeSlug, id: { not: params.id } },
    });
    if (slugTaken) {
      safeSlug = `${safeSlug}-${Date.now().toString(36)}`;
    }
  }

  // Determine new status
  let newStatus: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "PUBLISHED" | "REJECTED" = existing.status;
  if (status === "PENDING_REVIEW") {
    newStatus = "PENDING_REVIEW";
  } else if (status === "DRAFT") {
    newStatus = "DRAFT";
  }

  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      title: title ? sanitizeHtml(title) : existing.title,
      slug: safeSlug,
      content: content ?? existing.content,
      excerpt: excerpt !== undefined ? (excerpt ? sanitizeHtml(excerpt) : null) : existing.excerpt,
      image: image !== undefined ? (image || null) : existing.image,
      status: newStatus,
      reviewNote: newStatus === "PENDING_REVIEW" ? null : existing.reviewNote,
    },
  });

  return NextResponse.json(post);
}

// DELETE /api/user/blogs/[id] — delete a draft owned by the current user
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const existing = await prisma.blogPost.findFirst({
    where: { id: params.id, authorId: userId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Only allow deleting drafts
  if (existing.status !== "DRAFT") {
    return NextResponse.json(
      { error: "Only draft posts can be deleted" },
      { status: 403 }
    );
  }

  await prisma.blogPost.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}

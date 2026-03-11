import { NextResponse } from "next/server";
import { requirePermission, logAuditEvent } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

// PATCH /api/admin/blogs/[id]/review — approve or reject a blog post
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requirePermission("review_posts");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { action, note } = body as {
    action?: "approve" | "reject" | "publish";
    note?: string;
  };

  if (!action || !["approve", "reject", "publish"].includes(action)) {
    return NextResponse.json(
      { error: "Action must be 'approve', 'reject', or 'publish'" },
      { status: 400 }
    );
  }

  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (action === "approve") {
    if (post.status !== "PENDING_REVIEW") {
      return NextResponse.json(
        { error: "Only posts pending review can be approved" },
        { status: 400 }
      );
    }

    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        status: "APPROVED",
        reviewedBy: auth.user.id,
        reviewNote: note || null,
        reviewedAt: new Date(),
      },
    });

    await logAuditEvent(auth.user.id, "APPROVE_POST", `BlogPost:${post.id}`);
    return NextResponse.json(updated);
  }

  if (action === "reject") {
    if (post.status !== "PENDING_REVIEW") {
      return NextResponse.json(
        { error: "Only posts pending review can be rejected" },
        { status: 400 }
      );
    }

    if (!note) {
      return NextResponse.json(
        { error: "A review note is required when rejecting a post" },
        { status: 400 }
      );
    }

    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
        reviewedBy: auth.user.id,
        reviewNote: note,
        reviewedAt: new Date(),
      },
    });

    await logAuditEvent(auth.user.id, "REJECT_POST", `BlogPost:${post.id}`);
    return NextResponse.json(updated);
  }

  if (action === "publish") {
    if (post.status !== "APPROVED" && post.status !== "PENDING_REVIEW") {
      return NextResponse.json(
        { error: "Only approved or pending review posts can be published" },
        { status: 400 }
      );
    }

    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        status: "PUBLISHED",
        published: true,
        publishedAt: new Date(),
        reviewedBy: auth.user.id,
        reviewedAt: new Date(),
      },
    });

    await logAuditEvent(auth.user.id, "PUBLISH_POST", `BlogPost:${post.id}`);
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

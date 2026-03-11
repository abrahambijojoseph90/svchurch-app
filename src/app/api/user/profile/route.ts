import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/security";

// GET /api/user/profile — get current user's profile
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      avatar: true,
      bio: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get post counts
  const [postCount, publishedCount] = await Promise.all([
    prisma.blogPost.count({ where: { authorId: userId } }),
    prisma.blogPost.count({ where: { authorId: userId, status: "PUBLISHED" } }),
  ]);

  return NextResponse.json({
    ...user,
    postCount,
    publishedCount,
  });
}

// PUT /api/user/profile — update current user's profile
export async function PUT(request: Request) {
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

  const { name, bio, avatar } = body as {
    name?: string;
    bio?: string;
    avatar?: string;
  };

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (bio && bio.length > 500) {
    return NextResponse.json({ error: "Bio must be under 500 characters" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name: sanitizeHtml(name),
      bio: bio ? sanitizeHtml(bio) : null,
      avatar: avatar || null,
    },
    select: {
      name: true,
      email: true,
      avatar: true,
      bio: true,
    },
  });

  return NextResponse.json(updated);
}

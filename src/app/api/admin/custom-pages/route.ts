import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePermission, logAuditEvent } from "@/lib/api-auth";

export async function GET() {
  const auth = await requirePermission("manage_settings");
  if (auth instanceof NextResponse) return auth;

  const pages = await prisma.customPage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  const auth = await requirePermission("manage_settings");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, slug, content, excerpt, heroImage, published, parentSlug } = body as {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    heroImage?: string;
    published?: boolean;
    parentSlug?: string;
  };

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // Check slug uniqueness
  const existing = await prisma.customPage.findUnique({ where: { slug: finalSlug } });
  if (existing) {
    return NextResponse.json({ error: "A page with this slug already exists" }, { status: 400 });
  }

  const page = await prisma.customPage.create({
    data: {
      title,
      slug: finalSlug,
      content,
      excerpt: excerpt || null,
      heroImage: heroImage || null,
      published: published || false,
      publishedAt: published ? new Date() : null,
      parentSlug: parentSlug || null,
    },
  });

  await logAuditEvent(auth.user.id, "CREATE_PAGE", `CustomPage:${page.id}`);

  return NextResponse.json(page, { status: 201 });
}

export async function PUT(request: Request) {
  const auth = await requirePermission("manage_settings");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id, title, slug, content, excerpt, heroImage, published, parentSlug } = body as {
    id?: string;
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    heroImage?: string;
    published?: boolean;
    parentSlug?: string;
  };

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const existing = await prisma.customPage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  const page = await prisma.customPage.update({
    where: { id },
    data: {
      title: title || undefined,
      slug: slug || undefined,
      content: content || undefined,
      excerpt: excerpt !== undefined ? excerpt || null : undefined,
      heroImage: heroImage !== undefined ? heroImage || null : undefined,
      published: published !== undefined ? published : undefined,
      publishedAt: published && !existing.publishedAt ? new Date() : undefined,
      parentSlug: parentSlug !== undefined ? parentSlug || null : undefined,
    },
  });

  await logAuditEvent(auth.user.id, "UPDATE_PAGE", `CustomPage:${page.id}`);

  return NextResponse.json(page);
}

export async function DELETE(request: Request) {
  const auth = await requirePermission("manage_settings");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const existing = await prisma.customPage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  await prisma.customPage.delete({ where: { id } });
  await logAuditEvent(auth.user.id, "DELETE_PAGE", `CustomPage:${id}`);

  return NextResponse.json({ success: true });
}

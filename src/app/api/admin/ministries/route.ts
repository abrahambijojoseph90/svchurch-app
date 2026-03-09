import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePermission, logAuditEvent } from "@/lib/api-auth";
import { sanitizeHtml } from "@/lib/security";

export async function GET() {
  const auth = await requirePermission("manage_ministries");
  if (auth instanceof NextResponse) return auth;

  const ministries = await prisma.ministry.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(ministries);
}

export async function POST(request: Request) {
  const auth = await requirePermission("manage_ministries");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, slug, subtitle, description, fullContent, mission, schedule, location, image, bannerImage, icon, order } =
    body as {
      name?: string;
      slug?: string;
      subtitle?: string;
      description?: string;
      fullContent?: string;
      mission?: string;
      schedule?: string;
      location?: string;
      image?: string;
      bannerImage?: string;
      icon?: string;
      order?: number;
    };

  if (!name || !description) {
    return NextResponse.json(
      { error: "Name and description are required" },
      { status: 400 }
    );
  }

  const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const ministry = await prisma.ministry.create({
    data: {
      name: sanitizeHtml(name),
      slug: finalSlug,
      subtitle: subtitle ? sanitizeHtml(subtitle) : null,
      description: sanitizeHtml(description),
      fullContent: fullContent || null,
      mission: mission ? sanitizeHtml(mission) : null,
      schedule: schedule ? sanitizeHtml(schedule) : null,
      location: location ? sanitizeHtml(location) : null,
      image: image || null,
      bannerImage: bannerImage || null,
      icon: icon ? sanitizeHtml(icon) : null,
      order: typeof order === "number" ? order : 0,
    },
  });

  await logAuditEvent(auth.user.id, "CREATE_MINISTRY", `Ministry:${ministry.id}`);

  return NextResponse.json(ministry, { status: 201 });
}

export async function PUT(request: Request) {
  const auth = await requirePermission("manage_ministries");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id, name, slug, subtitle, description, fullContent, mission, schedule, location, image, bannerImage, icon, order } =
    body as {
      id?: string;
      name?: string;
      slug?: string;
      subtitle?: string;
      description?: string;
      fullContent?: string;
      mission?: string;
      schedule?: string;
      location?: string;
      image?: string;
      bannerImage?: string;
      icon?: string;
      order?: number;
    };

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const existing = await prisma.ministry.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
  }

  const ministry = await prisma.ministry.update({
    where: { id },
    data: {
      name: name ? sanitizeHtml(name) : undefined,
      slug: slug || undefined,
      subtitle: subtitle ? sanitizeHtml(subtitle) : null,
      description: description ? sanitizeHtml(description) : undefined,
      fullContent: fullContent !== undefined ? fullContent || null : undefined,
      mission: mission !== undefined ? (mission ? sanitizeHtml(mission) : null) : undefined,
      schedule: schedule ? sanitizeHtml(schedule) : null,
      location: location ? sanitizeHtml(location) : null,
      image: image || null,
      bannerImage: bannerImage !== undefined ? bannerImage || null : undefined,
      icon: icon ? sanitizeHtml(icon) : null,
      order: typeof order === "number" ? order : 0,
    },
  });

  await logAuditEvent(auth.user.id, "UPDATE_MINISTRY", `Ministry:${ministry.id}`);

  return NextResponse.json(ministry);
}

export async function DELETE(request: Request) {
  const auth = await requirePermission("manage_ministries");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const existing = await prisma.ministry.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
  }

  await prisma.ministry.delete({ where: { id } });

  await logAuditEvent(auth.user.id, "DELETE_MINISTRY", `Ministry:${id}`);

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePermission, logAuditEvent } from "@/lib/api-auth";
import { sanitizeHtml } from "@/lib/security";

export async function GET() {
  const auth = await requirePermission("manage_media");
  if (auth instanceof NextResponse) return auth;

  const media = await prisma.sermonMedia.findMany({
    orderBy: { date: "desc" },
  });

  return NextResponse.json(media);
}

export async function POST(request: Request) {
  const auth = await requirePermission("manage_media");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, speaker, date, type, url, thumbnail, description, youtubeId, published } =
    body as {
      title?: string;
      speaker?: string;
      date?: string;
      type?: string;
      url?: string;
      thumbnail?: string;
      description?: string;
      youtubeId?: string;
      published?: boolean;
    };

  if (!title || !url || !date) {
    return NextResponse.json(
      { error: "Title, URL, and date are required" },
      { status: 400 }
    );
  }

  const media = await prisma.sermonMedia.create({
    data: {
      title: sanitizeHtml(title),
      speaker: speaker ? sanitizeHtml(speaker) : null,
      date: new Date(date),
      type: type === "audio" ? "audio" : "video",
      url: url.trim(),
      thumbnail: thumbnail ? thumbnail.trim() : null,
      description: description ? sanitizeHtml(description) : null,
      youtubeId: youtubeId ? youtubeId.trim() : null,
      published: published ?? false,
    },
  });

  await logAuditEvent(auth.user.id, "CREATE_MEDIA", `SermonMedia:${media.id}`);

  return NextResponse.json(media, { status: 201 });
}

export async function PUT(request: Request) {
  const auth = await requirePermission("manage_media");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id, title, speaker, date, type, url, thumbnail, description, youtubeId, published } =
    body as {
      id?: string;
      title?: string;
      speaker?: string;
      date?: string;
      type?: string;
      url?: string;
      thumbnail?: string;
      description?: string;
      youtubeId?: string;
      published?: boolean;
    };

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const existing = await prisma.sermonMedia.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  const media = await prisma.sermonMedia.update({
    where: { id },
    data: {
      title: title ? sanitizeHtml(title) : undefined,
      speaker: speaker !== undefined ? (speaker ? sanitizeHtml(speaker) : null) : undefined,
      date: date ? new Date(date) : undefined,
      type: type ? (type === "audio" ? "audio" : "video") : undefined,
      url: url ? url.trim() : undefined,
      thumbnail: thumbnail !== undefined ? (thumbnail ? thumbnail.trim() : null) : undefined,
      description: description !== undefined ? (description ? sanitizeHtml(description) : null) : undefined,
      youtubeId: youtubeId !== undefined ? (youtubeId ? youtubeId.trim() : null) : undefined,
      published: typeof published === "boolean" ? published : undefined,
    },
  });

  await logAuditEvent(auth.user.id, "UPDATE_MEDIA", `SermonMedia:${media.id}`);

  return NextResponse.json(media);
}

export async function DELETE(request: Request) {
  const auth = await requirePermission("manage_media");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const existing = await prisma.sermonMedia.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  await prisma.sermonMedia.delete({ where: { id } });

  await logAuditEvent(auth.user.id, "DELETE_MEDIA", `SermonMedia:${id}`);

  return NextResponse.json({ success: true });
}

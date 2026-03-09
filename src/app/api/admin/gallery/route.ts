import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePermission, logAuditEvent } from "@/lib/api-auth";
import { sanitizeHtml } from "@/lib/security";

export async function GET() {
  const auth = await requirePermission("upload_gallery");
  if (auth instanceof NextResponse) return auth;

  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(images);
}

export async function POST(request: Request) {
  const auth = await requirePermission("upload_gallery");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { src, caption, order } = body as {
    src?: string;
    caption?: string;
    order?: number;
  };

  if (!src || typeof src !== "string") {
    return NextResponse.json(
      { error: "Image source URL is required" },
      { status: 400 }
    );
  }

  // Basic URL validation
  try {
    new URL(src);
  } catch {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  const image = await prisma.galleryImage.create({
    data: {
      src,
      caption: caption ? sanitizeHtml(caption) : null,
      order: typeof order === "number" ? order : 0,
    },
  });

  await logAuditEvent(auth.user.id, "UPLOAD_GALLERY", `GalleryImage:${image.id}`);

  return NextResponse.json(image, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requirePermission("delete_gallery");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  // Verify the record exists before deleting
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  await prisma.galleryImage.delete({ where: { id } });

  await logAuditEvent(auth.user.id, "DELETE_GALLERY", `GalleryImage:${id}`);

  return NextResponse.json({ success: true });
}

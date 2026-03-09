import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(images);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { src, caption, order } = body;

  if (!src) {
    return NextResponse.json(
      { error: "Image source URL is required" },
      { status: 400 }
    );
  }

  const image = await prisma.galleryImage.create({
    data: {
      src,
      caption: caption || null,
      order: order ?? 0,
    },
  });

  return NextResponse.json(image, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await prisma.galleryImage.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

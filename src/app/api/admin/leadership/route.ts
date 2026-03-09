import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leaders = await prisma.leader.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(leaders);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, role, bio, image, socials, order } = body;

  if (!name || !role) {
    return NextResponse.json(
      { error: "Name and role are required" },
      { status: 400 }
    );
  }

  const leader = await prisma.leader.create({
    data: {
      name,
      role,
      bio: bio || null,
      image: image || null,
      socials: socials || null,
      order: order ?? 0,
    },
  });

  return NextResponse.json(leader, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, name, role, bio, image, socials, order } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const leader = await prisma.leader.update({
    where: { id },
    data: {
      name,
      role,
      bio: bio || null,
      image: image || null,
      socials: socials || null,
      order: order ?? 0,
    },
  });

  return NextResponse.json(leader);
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

  await prisma.leader.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

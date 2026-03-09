import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ministries = await prisma.ministry.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(ministries);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, subtitle, description, schedule, location, image, icon, order } = body;

  if (!name || !description) {
    return NextResponse.json(
      { error: "Name and description are required" },
      { status: 400 }
    );
  }

  const ministry = await prisma.ministry.create({
    data: {
      name,
      subtitle: subtitle || null,
      description,
      schedule: schedule || null,
      location: location || null,
      image: image || null,
      icon: icon || null,
      order: order ?? 0,
    },
  });

  return NextResponse.json(ministry, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, name, subtitle, description, schedule, location, image, icon, order } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const ministry = await prisma.ministry.update({
    where: { id },
    data: {
      name,
      subtitle: subtitle || null,
      description,
      schedule: schedule || null,
      location: location || null,
      image: image || null,
      icon: icon || null,
      order: order ?? 0,
    },
  });

  return NextResponse.json(ministry);
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

  await prisma.ministry.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

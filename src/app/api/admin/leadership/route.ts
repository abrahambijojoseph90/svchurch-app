import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requirePermission, logAuditEvent } from "@/lib/api-auth";
import { sanitizeHtml } from "@/lib/security";

export async function GET() {
  const auth = await requirePermission("manage_leadership");
  if (auth instanceof NextResponse) return auth;

  const leaders = await prisma.leader.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(leaders);
}

export async function POST(request: Request) {
  const auth = await requirePermission("manage_leadership");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, role, bio, image, socials, order } = body as {
    name?: string;
    role?: string;
    bio?: string;
    image?: string;
    socials?: Record<string, string>;
    order?: number;
  };

  if (!name || !role) {
    return NextResponse.json(
      { error: "Name and role are required" },
      { status: 400 }
    );
  }

  const leader = await prisma.leader.create({
    data: {
      name: sanitizeHtml(name),
      role: sanitizeHtml(role),
      bio: bio ? sanitizeHtml(bio) : null,
      image: image || null,
      socials: socials || Prisma.JsonNull,
      order: typeof order === "number" ? order : 0,
    },
  });

  await logAuditEvent(auth.user.id, "CREATE_LEADER", `Leader:${leader.id}`);

  return NextResponse.json(leader, { status: 201 });
}

export async function PUT(request: Request) {
  const auth = await requirePermission("manage_leadership");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id, name, role, bio, image, socials, order } = body as {
    id?: string;
    name?: string;
    role?: string;
    bio?: string;
    image?: string;
    socials?: Record<string, string>;
    order?: number;
  };

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  // Verify record exists
  const existing = await prisma.leader.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Leader not found" }, { status: 404 });
  }

  const leader = await prisma.leader.update({
    where: { id },
    data: {
      name: name ? sanitizeHtml(name) : undefined,
      role: role ? sanitizeHtml(role) : undefined,
      bio: bio ? sanitizeHtml(bio) : null,
      image: image || null,
      socials: socials || Prisma.JsonNull,
      order: typeof order === "number" ? order : 0,
    },
  });

  await logAuditEvent(auth.user.id, "UPDATE_LEADER", `Leader:${leader.id}`);

  return NextResponse.json(leader);
}

export async function DELETE(request: Request) {
  const auth = await requirePermission("manage_leadership");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const existing = await prisma.leader.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Leader not found" }, { status: 404 });
  }

  await prisma.leader.delete({ where: { id } });

  await logAuditEvent(auth.user.id, "DELETE_LEADER", `Leader:${id}`);

  return NextResponse.json({ success: true });
}

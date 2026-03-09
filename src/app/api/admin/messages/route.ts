import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePermission, logAuditEvent } from "@/lib/api-auth";

export async function GET() {
  const auth = await requirePermission("view_messages");
  if (auth instanceof NextResponse) return auth;

  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(messages);
}

export async function PATCH(request: Request) {
  const auth = await requirePermission("view_messages");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id } = body as { id?: string };

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  // Verify record exists
  const existing = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  const message = await prisma.contactSubmission.update({
    where: { id },
    data: { read: true },
  });

  await logAuditEvent(auth.user.id, "READ_MESSAGE", `ContactSubmission:${id}`);

  return NextResponse.json(message);
}

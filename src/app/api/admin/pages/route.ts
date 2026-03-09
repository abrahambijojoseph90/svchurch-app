import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePermission, logAuditEvent } from "@/lib/api-auth";
import { sanitizeHtml } from "@/lib/security";

export async function GET(request: Request) {
  const auth = await requirePermission("manage_settings");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("page");

  const where = pageSlug ? { pageSlug } : {};
  const content = await prisma.pageContent.findMany({
    where,
    orderBy: [{ pageSlug: "asc" }, { section: "asc" }],
  });

  // Return as { pageSlug: { section: content } }
  const grouped: Record<string, Record<string, string>> = {};
  for (const item of content) {
    if (!grouped[item.pageSlug]) grouped[item.pageSlug] = {};
    grouped[item.pageSlug][item.section] = item.content;
  }

  return NextResponse.json(grouped);
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

  const { pageSlug, sections } = body as {
    pageSlug?: string;
    sections?: Record<string, string>;
  };

  if (!pageSlug || !sections) {
    return NextResponse.json(
      { error: "pageSlug and sections are required" },
      { status: 400 }
    );
  }

  // Upsert each section
  const results = [];
  for (const [section, content] of Object.entries(sections)) {
    const result = await prisma.pageContent.upsert({
      where: { pageSlug_section: { pageSlug, section } },
      update: { content: sanitizeHtml(content) },
      create: {
        pageSlug,
        section,
        content: sanitizeHtml(content),
      },
    });
    results.push(result);
  }

  await logAuditEvent(auth.user.id, "UPDATE_PAGE", `Page:${pageSlug}`);

  return NextResponse.json({ success: true, count: results.length });
}

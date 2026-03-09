import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePermission } from "@/lib/api-auth";
import { sanitizeHtml } from "@/lib/security";

export async function GET() {
  const auth = await requirePermission("manage_settings");
  if (auth instanceof NextResponse) return auth;

  const rows = await prisma.siteSettings.findMany();

  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }

  return NextResponse.json(settings);
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

  const incoming = body.settings as Record<string, string> | undefined;
  if (!incoming || typeof incoming !== "object") {
    return NextResponse.json(
      { error: "Missing settings object" },
      { status: 400 }
    );
  }

  try {
    for (const [key, value] of Object.entries(incoming)) {
      const sanitizedValue = sanitizeHtml(String(value));
      await prisma.siteSettings.upsert({
        where: { key },
        update: { value: sanitizedValue },
        create: { key, value: sanitizedValue },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save settings:", err);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { checkRateLimit, sanitizeHtml, isValidEmail } from "@/lib/security";

// Max lengths to prevent abuse
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: Request) {
  try {
    // Rate limit: 5 submissions per 15 minutes per IP
    const headersList = headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`contact:${ip}`, 5, 15 * 60_000)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    // Required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Type checks
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      (phone !== undefined && phone !== null && typeof phone !== "string")
    ) {
      return NextResponse.json(
        { error: "Invalid field types" },
        { status: 400 }
      );
    }

    // Length checks
    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name must be under ${MAX_NAME_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }
    if (phone && phone.length > MAX_PHONE_LENGTH) {
      return NextResponse.json(
        { error: `Phone must be under ${MAX_PHONE_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Email format validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Sanitize inputs (strip HTML tags to prevent stored XSS)
    const sanitizedName = sanitizeHtml(name);
    const sanitizedMessage = sanitizeHtml(message);
    const sanitizedPhone = phone ? sanitizeHtml(phone) : null;

    if (!sanitizedName || !sanitizedMessage) {
      return NextResponse.json(
        { error: "Name and message cannot be empty after sanitization" },
        { status: 400 }
      );
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name: sanitizedName,
        email: email.trim().toLowerCase(),
        phone: sanitizedPhone,
        message: sanitizedMessage,
      },
    });

    return NextResponse.json(
      { success: true, id: submission.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

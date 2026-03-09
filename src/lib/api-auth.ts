/**
 * API route authentication & authorization helper.
 * Use in every admin API route to verify session + role.
 */

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { hasPermission, type Role } from "@/lib/permissions";
import prisma from "@/lib/prisma";

type Permission = Parameters<typeof hasPermission>[1];

interface AuthResult {
  user: { id: string; email: string; role: Role; name: string };
}

/**
 * Authenticate the request and check a specific permission.
 * Returns the user if authorized, or a NextResponse error.
 */
export async function requirePermission(
  permission: Permission
): Promise<AuthResult | NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role as Role | undefined;
  if (!role || !hasPermission(role, permission)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return {
    user: {
      id: (session.user as { id: string }).id,
      email: session.user.email,
      role,
      name: session.user.name || "",
    },
  };
}

/**
 * Log an admin action to the audit trail.
 */
export async function logAuditEvent(
  userId: string,
  action: string,
  target?: string,
  details?: Record<string, string | number | boolean | null>,
  ipAddress?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        target,
        details: details ? (details as Record<string, string | number | boolean | null>) : undefined,
        ipAddress,
      },
    });
  } catch {
    // Don't let audit logging failures break the main request
    console.error("Failed to log audit event:", action);
  }
}

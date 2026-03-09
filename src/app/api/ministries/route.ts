import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const ministries = await prisma.ministry.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(ministries);
  } catch {
    return NextResponse.json([]);
  }
}

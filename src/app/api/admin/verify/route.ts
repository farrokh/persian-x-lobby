import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// POST /api/admin/verify - Verify admin password
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    // No password configured — allow access
    return NextResponse.json({ valid: true });
  }

  if (password === adminPassword) {
    return NextResponse.json({ valid: true });
  }

  return NextResponse.json({ valid: false }, { status: 403 });
}

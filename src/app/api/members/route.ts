import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

// GET /api/members - List all members
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();
  const { data: members } = await db
    .from("members")
    .select("id, x_handle, display_name, joined_at")
    .order("joined_at", { ascending: true });

  return NextResponse.json({ members: members || [] });
}

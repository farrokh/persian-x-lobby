import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

// POST /api/sync-manual - Manual sync using session cookie
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { handles } = body;

  if (!Array.isArray(handles) || handles.length === 0) {
    return NextResponse.json({ error: "No handles provided" }, { status: 400 });
  }

  const cleanHandles = handles
    .map((h: string) => h.replace(/^@/, "").toLowerCase().trim())
    .filter((h: string) => /^[a-zA-Z0-9_]{1,15}$/.test(h));

  const db = getServiceClient();

  await db.from("follow_relationships").delete().eq("follower_id", session.memberId);

  const rows = cleanHandles.map((handle: string) => ({
    follower_id: session.memberId,
    following_x_handle: handle,
  }));

  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    await db.from("follow_relationships").insert(batch);
  }

  await db.from("sync_logs").insert({
    member_id: session.memberId,
    handles_count: cleanHandles.length,
  });

  return NextResponse.json({ success: true, count: cleanHandles.length });
}

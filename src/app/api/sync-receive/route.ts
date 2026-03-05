import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

// GET /api/sync-receive?token=xxx&handles=a,b,c
// The bookmarklet redirects here with collected handles as a query param.
// We store them, then redirect to the dashboard with a success message.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const handlesParam = req.nextUrl.searchParams.get("handles");

  if (!token || !handlesParam) {
    return NextResponse.redirect(new URL("/sync?error=missing_params", req.url));
  }

  const session = await verifyToken(token);
  if (!session) {
    return NextResponse.redirect(new URL("/login?error=expired_token", req.url));
  }

  const handles = handlesParam
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter((h) => /^[a-zA-Z0-9_]{1,15}$/.test(h));

  if (handles.length === 0) {
    return NextResponse.redirect(new URL("/sync?error=no_handles", req.url));
  }

  const db = getServiceClient();

  // Clear old
  const { error: deleteError } = await db
    .from("follow_relationships")
    .delete()
    .eq("follower_id", session.memberId);

  if (deleteError) {
    console.error("Delete error:", deleteError);
  }

  // Insert new in batches
  let insertErrors = 0;
  const rows = handles.map((handle) => ({
    follower_id: session.memberId,
    following_x_handle: handle,
  }));

  for (let i = 0; i < rows.length; i += 500) {
    const { error: insertError } = await db
      .from("follow_relationships")
      .insert(rows.slice(i, i + 500));
    if (insertError) {
      console.error("Insert error:", insertError);
      insertErrors++;
    }
  }

  // Log the sync
  const { error: logError } = await db.from("sync_logs").insert({
    member_id: session.memberId,
    handles_count: handles.length,
  });

  if (logError) {
    console.error("Sync log error:", logError);
  }

  if (insertErrors > 0) {
    return NextResponse.redirect(new URL(`/sync?error=insert_failed`, req.url));
  }

  return NextResponse.redirect(new URL(`/dashboard?synced=${handles.length}`, req.url));
}

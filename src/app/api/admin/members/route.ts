import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();

  const { data: members } = await db
    .from("members")
    .select("*")
    .order("joined_at", { ascending: true });

  if (!members) {
    return NextResponse.json({ members: [] });
  }

  // Get all follow relationships
  const { data: allFollows } = await db
    .from("follow_relationships")
    .select("follower_id, following_x_handle");

  // Get all sync logs (latest per member)
  const { data: syncLogs } = await db
    .from("sync_logs")
    .select("member_id, synced_at")
    .order("synced_at", { ascending: false });

  const allHandles = members.map((m) => m.x_handle);

  const enriched = members.map((m) => {
    const myFollows = (allFollows || []).filter((f) => f.follower_id === m.id);
    const myFollowedHandles = new Set(myFollows.map((f) => f.following_x_handle));
    const followingCount = allHandles.filter((h) => h !== m.x_handle && myFollowedHandles.has(h)).length;

    const followersCount = members.filter((other) => {
      if (other.id === m.id) return false;
      const otherFollows = (allFollows || []).filter((f) => f.follower_id === other.id);
      return otherFollows.some((f) => f.following_x_handle === m.x_handle);
    }).length;

    const lastSync = (syncLogs || []).find((s) => s.member_id === m.id);

    return {
      id: m.id,
      x_handle: m.x_handle,
      display_name: m.display_name,
      email: m.email,
      joined_at: m.joined_at,
      lastSync: lastSync?.synced_at || null,
      followingCount,
      followersCount,
    };
  });

  return NextResponse.json({ members: enriched });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing member id" }, { status: 400 });
  }

  const db = getServiceClient();
  await db.from("members").delete().eq("id", id);

  return NextResponse.json({ success: true });
}

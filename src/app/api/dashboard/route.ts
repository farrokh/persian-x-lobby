import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();

  // Get current member
  const { data: member } = await db
    .from("members")
    .select("*")
    .eq("id", session.memberId)
    .single();

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // Get all members
  const { data: allMembers } = await db
    .from("members")
    .select("id, x_handle, display_name");

  const allHandles = (allMembers || []).map((m) => m.x_handle);

  // Get who I follow
  const { data: myFollows } = await db
    .from("follow_relationships")
    .select("following_x_handle")
    .eq("follower_id", session.memberId);

  const myFollowedHandles = new Set((myFollows || []).map((f) => f.following_x_handle));

  // Who I need to follow (group members I don't follow, excluding myself)
  const needToFollow = allHandles.filter(
    (h) => h !== member.x_handle && !myFollowedHandles.has(h)
  );

  // Who hasn't followed me (members whose follow list doesn't include my handle)
  const { data: followersOfMe } = await db
    .from("follow_relationships")
    .select("follower_id")
    .eq("following_x_handle", member.x_handle);

  const followerIds = new Set((followersOfMe || []).map((f) => f.follower_id));
  const notFollowingYou = (allMembers || [])
    .filter((m) => m.id !== member.id && !followerIds.has(m.id))
    .map((m) => m.x_handle);

  // Last sync
  const { data: lastSyncLog } = await db
    .from("sync_logs")
    .select("synced_at")
    .eq("member_id", session.memberId)
    .order("synced_at", { ascending: false })
    .limit(1)
    .single();

  const followingGroupMembers = allHandles.filter(
    (h) => h !== member.x_handle && myFollowedHandles.has(h)
  ).length;

  return NextResponse.json({
    member: { x_handle: member.x_handle, display_name: member.display_name },
    needToFollow,
    notFollowingYou,
    lastSync: lastSyncLog?.synced_at || null,
    totalMembers: allHandles.length,
    followingCount: followingGroupMembers,
  });
}

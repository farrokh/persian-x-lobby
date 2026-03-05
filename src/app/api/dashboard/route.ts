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
    .select("id, x_handle, display_name, joined_at");

  const members = allMembers || [];

  // Get who I follow
  const { data: myFollows } = await db
    .from("follow_relationships")
    .select("following_x_handle")
    .eq("follower_id", session.memberId);

  const myFollowedHandles = new Set((myFollows || []).map((f) => f.following_x_handle));

  // Who I need to follow
  const needToFollow = members
    .filter((m) => m.x_handle !== member.x_handle && !myFollowedHandles.has(m.x_handle))
    .map((m) => ({ x_handle: m.x_handle, display_name: m.display_name }));

  // Who hasn't followed me
  const { data: followersOfMe } = await db
    .from("follow_relationships")
    .select("follower_id")
    .eq("following_x_handle", member.x_handle);

  const followerIds = new Set((followersOfMe || []).map((f) => f.follower_id));
  const notFollowingYou = members
    .filter((m) => m.id !== member.id && !followerIds.has(m.id))
    .map((m) => ({ x_handle: m.x_handle, display_name: m.display_name }));

  // Last sync
  const { data: lastSyncLog } = await db
    .from("sync_logs")
    .select("synced_at")
    .eq("member_id", session.memberId)
    .order("synced_at", { ascending: false })
    .limit(1)
    .single();

  const followingGroupMembers = members.filter(
    (m) => m.x_handle !== member.x_handle && myFollowedHandles.has(m.x_handle)
  ).length;

  // Hot posts (graceful fallback if table doesn't exist yet)
  let hotPosts: Array<{
    id: string;
    x_post_url: string;
    author_handle: string;
    content_preview: string;
    likes: number;
    retweets: number;
    created_at: string;
  }> = [];
  try {
    const { data: posts } = await db
      .from("hot_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);
    hotPosts = posts || [];
  } catch {
    // Table may not exist yet
  }

  // All members for spotlight
  const allMemberHandles = members.map((m) => ({
    x_handle: m.x_handle,
    display_name: m.display_name,
  }));

  return NextResponse.json({
    member: { x_handle: member.x_handle, display_name: member.display_name, isAdmin: member.is_admin },
    needToFollow,
    notFollowingYou,
    lastSync: lastSyncLog?.synced_at || null,
    totalMembers: members.length,
    followingCount: followingGroupMembers,
    hotPosts,
    allMembers: allMemberHandles,
  });
}

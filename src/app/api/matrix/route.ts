import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();

  const { data: members } = await db
    .from("members")
    .select("id, x_handle, display_name")
    .order("joined_at", { ascending: true });

  if (!members) {
    return NextResponse.json({ members: [], matrix: {}, stats: [] });
  }

  const { data: allFollows } = await db
    .from("follow_relationships")
    .select("follower_id, following_x_handle");

  // Build matrix: memberId -> Set of handles they follow
  const matrix: Record<string, string[]> = {};
  for (const m of members) {
    matrix[m.id] = [];
  }
  for (const f of allFollows || []) {
    if (matrix[f.follower_id]) {
      matrix[f.follower_id].push(f.following_x_handle);
    }
  }

  const allHandles = members.map((m) => m.x_handle);
  const totalOthers = members.length - 1;

  // Stats
  const stats = members.map((m) => {
    const followingSet = new Set(matrix[m.id]);
    const followingGroupCount = allHandles.filter(
      (h) => h !== m.x_handle && followingSet.has(h)
    ).length;

    // Count followers (people who follow this member)
    const followersCount = members.filter((other) => {
      if (other.id === m.id) return false;
      return new Set(matrix[other.id]).has(m.x_handle);
    }).length;

    return {
      handle: m.x_handle,
      following: followingGroupCount,
      followers: followersCount,
      pct: totalOthers > 0 ? Math.round((followingGroupCount / totalOthers) * 100) : 100,
    };
  });

  return NextResponse.json({ members, matrix, stats });
}

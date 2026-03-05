import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { sendDigestEmail } from "@/lib/email";

// POST /api/digest - Trigger email digest (protected by cron secret or admin)
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const adminSecret = process.env.ADMIN_SECRET;

  if (authHeader !== `Bearer ${cronSecret}` && authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();

  // Get all members
  const { data: members } = await db.from("members").select("*");
  if (!members || members.length === 0) {
    return NextResponse.json({ message: "No members" });
  }

  const allHandles = members.map((m) => m.x_handle);
  let emailsSent = 0;

  for (const member of members) {
    // Get who this member follows
    const { data: follows } = await db
      .from("follow_relationships")
      .select("following_x_handle")
      .eq("follower_id", member.id);

    const followedHandles = new Set((follows || []).map((f) => f.following_x_handle));

    // Find group members they don't follow (excluding themselves)
    const unfollowed = allHandles.filter((h) => h !== member.x_handle && !followedHandles.has(h));

    if (unfollowed.length > 0 && member.email) {
      try {
        await sendDigestEmail({
          memberEmail: member.email,
          memberHandle: member.x_handle,
          unfollowed,
        });
        emailsSent++;
      } catch (err) {
        console.error(`Failed to send digest to ${member.email}:`, err);
      }
    }
  }

  return NextResponse.json({ success: true, emailsSent });
}

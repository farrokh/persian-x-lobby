import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { sendDigestEmail } from "@/lib/email";

export async function POST() {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();

  const { data: members } = await db.from("members").select("*");
  if (!members || members.length === 0) {
    return NextResponse.json({ message: "No members", emailsSent: 0 });
  }

  const allHandles = members.map((m) => m.x_handle);
  let emailsSent = 0;

  for (const member of members) {
    const { data: follows } = await db
      .from("follow_relationships")
      .select("following_x_handle")
      .eq("follower_id", member.id);

    const followedHandles = new Set((follows || []).map((f) => f.following_x_handle));
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

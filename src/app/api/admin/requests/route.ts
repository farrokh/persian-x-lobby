import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { sendInviteEmail } from "@/lib/email";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "XG-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function requireAdmin() {
  const session = await getSession();
  if (!session?.isAdmin) return null;
  return session;
}

// GET /api/admin/requests - List pending access requests
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();
  const { data: requests } = await db
    .from("access_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ requests: requests || [] });
}

// POST /api/admin/requests - Approve a request
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing request id" }, { status: 400 });
  }

  const db = getServiceClient();

  // Get the request
  const { data: request } = await db
    .from("access_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (request.status !== "pending") {
    return NextResponse.json({ error: "Request already processed" }, { status: 400 });
  }

  // Generate invite code
  const inviteCode = generateInviteCode();

  // Update request status
  const { error } = await db
    .from("access_requests")
    .update({ status: "approved", invite_code: inviteCode })
    .eq("id", id);

  if (error) {
    console.error("Failed to approve request:", error.message);
    return NextResponse.json({ error: "Failed to approve" }, { status: 500 });
  }

  // Add invite code to valid codes in env (store in DB for persistence)
  // For now, we register the member directly since we have all the info
  // Actually - send them an email with the invite code so they can join themselves

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://laspag.org";
  const joinUrl = `${baseUrl}/join?code=${encodeURIComponent(inviteCode)}`;

  try {
    console.log("Sending invite email to:", request.email, "from:", process.env.EMAIL_FROM);
    await sendInviteEmail({
      to: request.email,
      handle: request.x_handle,
      name: request.name,
      inviteCode,
      joinUrl,
    });
    console.log("Invite email sent successfully");
  } catch (e) {
    console.error("Failed to send invite email:", e);
    return NextResponse.json({ error: `Approved but failed to send email: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 });
  }

  return NextResponse.json({ success: true, inviteCode });
}

// DELETE /api/admin/requests - Reject a request
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const db = getServiceClient();
  const { error } = await db
    .from("access_requests")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to reject" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

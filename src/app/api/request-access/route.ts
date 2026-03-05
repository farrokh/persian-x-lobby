import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

// POST /api/request-access - Public endpoint for access requests
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { x_handle, email, name, message } = body;

  if (!x_handle || !email) {
    return NextResponse.json({ error: "X handle and email are required" }, { status: 400 });
  }

  const handle = x_handle.replace(/^@/, "").toLowerCase().trim();
  if (!/^[a-zA-Z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json({ error: "Invalid X handle" }, { status: 400 });
  }

  const db = getServiceClient();

  // Check if already a member
  const { data: existing } = await db.from("members").select("id").eq("x_handle", handle).single();
  if (existing) {
    return NextResponse.json({ error: "This handle is already a member" }, { status: 409 });
  }

  // Check if already requested
  const { data: existingReq } = await db
    .from("access_requests")
    .select("id")
    .eq("x_handle", handle)
    .eq("status", "pending")
    .single();
  if (existingReq) {
    return NextResponse.json({ error: "You already have a pending request" }, { status: 409 });
  }

  const { error } = await db.from("access_requests").insert({
    x_handle: handle,
    email,
    name: name || null,
    message: message || null,
  });

  if (error) {
    console.error("Failed to insert access request:", error.message);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

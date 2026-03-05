import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { createToken, createSessionCookie, getValidInviteCodes } from "@/lib/auth";

// POST /api/auth - Register or login
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "register") {
    return handleRegister(body);
  } else if (action === "login") {
    return handleLogin(body);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

async function handleRegister(body: { x_handle: string; email: string; invite_code: string; display_name?: string }) {
  const { x_handle, email, invite_code, display_name } = body;

  if (!x_handle || !email || !invite_code) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const handle = x_handle.replace(/^@/, "").toLowerCase().trim();
  if (!/^[a-zA-Z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json({ error: "Invalid X handle" }, { status: 400 });
  }

  const validCodes = getValidInviteCodes();
  if (!validCodes.includes(invite_code.trim())) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 403 });
  }

  const db = getServiceClient();

  // Check if handle already exists
  const { data: existing } = await db.from("members").select("id").eq("x_handle", handle).single();
  if (existing) {
    return NextResponse.json({ error: "This X handle is already registered" }, { status: 409 });
  }

  const { data: member, error } = await db
    .from("members")
    .insert({ x_handle: handle, email, invite_code: invite_code.trim(), display_name: display_name || null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }

  const token = await createToken({ memberId: member.id, xHandle: handle, isAdmin: member.is_admin });
  await createSessionCookie(token);

  return NextResponse.json({ success: true, member: { id: member.id, x_handle: handle } });
}

async function handleLogin(body: { x_handle: string; invite_code: string }) {
  const { x_handle, invite_code } = body;

  if (!x_handle || !invite_code) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const handle = x_handle.replace(/^@/, "").toLowerCase().trim();
  const db = getServiceClient();

  const { data: member } = await db.from("members").select("*").eq("x_handle", handle).single();
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  if (member.invite_code !== invite_code.trim()) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 403 });
  }

  const token = await createToken({ memberId: member.id, xHandle: handle, isAdmin: member.is_admin });
  await createSessionCookie(token);

  return NextResponse.json({ success: true, member: { id: member.id, x_handle: handle } });
}

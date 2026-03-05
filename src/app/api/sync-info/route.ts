import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getSession, createToken } from "@/lib/auth";
import { generateBookmarkletCode, generateConsoleScript } from "@/lib/bookmarklet";
import { headers } from "next/headers";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();

  // Generate a token for the bookmarklet
  const token = await createToken({
    memberId: session.memberId,
    xHandle: session.xHandle,
    isAdmin: session.isAdmin,
  });

  // Determine base URL
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const bookmarkletUrl = generateBookmarkletCode(baseUrl, token, session.xHandle);

  // Last sync
  const { data: lastSyncLog } = await db
    .from("sync_logs")
    .select("synced_at")
    .eq("member_id", session.memberId)
    .order("synced_at", { ascending: false })
    .limit(1)
    .single();

  const consoleScript = generateConsoleScript(baseUrl, token, session.xHandle);

  return NextResponse.json({
    bookmarkletUrl,
    consoleScript,
    lastSync: lastSyncLog?.synced_at || null,
    xHandle: session.xHandle,
  });
}

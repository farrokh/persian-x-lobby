import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

// GET /api/hot-posts - Get featured posts for dashboard
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();
  const { data: posts } = await db
    .from("hot_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  return NextResponse.json({ posts: posts || [] });
}

// POST /api/hot-posts - Admin adds a featured post (just needs the URL)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { x_post_url } = body;

  if (!x_post_url) {
    return NextResponse.json({ error: "Post URL is required" }, { status: 400 });
  }

  // Extract handle from URL: https://x.com/username/status/123
  const urlMatch = x_post_url.match(/(?:x\.com|twitter\.com)\/([^/]+)\/status\/(\d+)/);
  if (!urlMatch) {
    return NextResponse.json({ error: "Invalid X post URL" }, { status: 400 });
  }
  const author_handle = urlMatch[1].toLowerCase();

  // Fetch tweet content via X's oEmbed API (no auth required)
  let content_preview = "";
  try {
    const cleanUrl = `https://x.com/${urlMatch[1]}/status/${urlMatch[2]}`;
    const oembedRes = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(cleanUrl)}&omit_script=true`
    );
    if (oembedRes.ok) {
      const oembed = await oembedRes.json();
      // Strip HTML tags from the embedded HTML to get plain text
      content_preview = oembed.html
        ?.replace(/<blockquote[^>]*>/, "")
        ?.replace(/<\/blockquote>/, "")
        ?.replace(/<[^>]+>/g, "")
        ?.replace(/&mdash;.*$/, "")
        ?.replace(/&amp;/g, "&")
        ?.replace(/&lt;/g, "<")
        ?.replace(/&gt;/g, ">")
        ?.replace(/&quot;/g, '"')
        ?.trim()
        ?.slice(0, 280) || "";
    }
  } catch {
    // oEmbed failed — proceed with empty preview
  }

  const db = getServiceClient();
  const { data, error } = await db
    .from("hot_posts")
    .insert({
      x_post_url: `https://x.com/${urlMatch[1]}/status/${urlMatch[2]}`,
      author_handle,
      content_preview: content_preview || "(No preview available)",
      likes: 0,
      retweets: 0,
      added_by: session.memberId,
    })
    .select()
    .single();

  if (error) {
    console.error("hot_posts insert error:", error);
    return NextResponse.json({ error: error.message || "Failed to add post" }, { status: 500 });
  }

  return NextResponse.json({ post: data });
}

// DELETE /api/hot-posts?id=xxx - Admin removes a featured post
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing post id" }, { status: 400 });
  }

  const db = getServiceClient();
  await db.from("hot_posts").delete().eq("id", id);

  return NextResponse.json({ success: true });
}

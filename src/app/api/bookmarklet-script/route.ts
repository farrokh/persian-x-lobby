import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// GET /api/bookmarklet-script?token=xxx — returns the full sync script as JS
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse("alert('Missing token')", {
      headers: { "Content-Type": "application/javascript" },
    });
  }

  const session = await verifyToken(token);
  if (!session) {
    return new NextResponse("alert('Invalid or expired token. Please get a new bookmarklet from the sync page.')", {
      headers: { "Content-Type": "application/javascript" },
    });
  }

  const host = req.nextUrl.origin;

  const script = `
(async function() {
  const API_URL = '${host}/api/sync';
  const TOKEN = '${token}';

  if (!window.location.href.includes('/following')) {
    alert('Please navigate to your X Following page first!\\nGo to: x.com/YOUR_HANDLE/following');
    return;
  }

  // Status overlay
  const statusDiv = document.createElement('div');
  statusDiv.style.cssText = 'position:fixed;top:10px;right:10px;z-index:99999;background:#1a1a2e;color:#e0e0e0;padding:16px 24px;border-radius:12px;font-family:system-ui;font-size:14px;box-shadow:0 4px 20px rgba(0,0,0,0.3);min-width:220px;';
  statusDiv.textContent = 'Collecting handles... Please wait.';
  document.body.appendChild(statusDiv);

  const handles = new Set();
  let lastCount = 0;
  let stableRounds = 0;

  // Find the scrollable container (X uses a nested scrollable div)
  function getScrollContainer() {
    // Try the main timeline scrollable area
    const primary = document.querySelector('[data-testid="primaryColumn"]');
    if (primary) {
      const scrollable = primary.closest('[style*="overflow"]') || primary.closest('[class*="scroll"]');
      if (scrollable) return scrollable;
    }
    return window;
  }

  function extractHandles() {
    // Strategy 1: data-testid UserCell
    document.querySelectorAll('[data-testid="UserCell"] a[href^="/"]').forEach(function(a) {
      const href = a.getAttribute('href');
      if (href && /^\\/[a-zA-Z0-9_]{1,15}$/.test(href)) {
        const h = href.slice(1).toLowerCase();
        var skip = ['home','explore','notifications','messages','settings','search','i','compose','premium','communities','lists'];
        if (!skip.includes(h)) handles.add(h);
      }
    });

    // Strategy 2: fallback — look for any link with @ text inside user-like cells
    document.querySelectorAll('div[data-testid] span').forEach(function(span) {
      const text = span.textContent || '';
      const match = text.match(/^@([a-zA-Z0-9_]{1,15})$/);
      if (match) handles.add(match[1].toLowerCase());
    });

    // Strategy 3: look for /username links in the following list area
    document.querySelectorAll('a[role="link"][href^="/"]').forEach(function(a) {
      var parent = a.closest('[data-testid="cellInnerDiv"]') || a.closest('[data-testid="UserCell"]');
      if (!parent) return;
      var href = a.getAttribute('href');
      if (href && /^\\/[a-zA-Z0-9_]{1,15}$/.test(href)) {
        var h = href.slice(1).toLowerCase();
        var skip = ['home','explore','notifications','messages','settings','search','i','compose','premium','communities','lists'];
        if (!skip.includes(h)) handles.add(h);
      }
    });
  }

  for (let i = 0; i < 300; i++) {
    extractHandles();
    statusDiv.textContent = 'Scrolling... ' + handles.size + ' handles found';

    if (handles.size === lastCount) {
      stableRounds++;
      if (stableRounds >= 8) break;
    } else {
      stableRounds = 0;
      lastCount = handles.size;
    }

    window.scrollBy(0, 600);
    await new Promise(function(r) { setTimeout(r, 400); });
  }

  if (handles.size === 0) {
    statusDiv.style.background = '#5c1a1a';
    statusDiv.textContent = 'No handles found. Make sure you are on x.com/YOUR_HANDLE/following';
    setTimeout(function() { statusDiv.remove(); }, 5000);
    return;
  }

  statusDiv.textContent = 'Uploading ' + handles.size + ' handles...';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
      body: JSON.stringify({ handles: Array.from(handles) })
    });
    const data = await res.json();
    if (res.ok) {
      statusDiv.style.background = '#1b4332';
      statusDiv.textContent = 'Synced ' + handles.size + ' handles!';
    } else {
      statusDiv.style.background = '#5c1a1a';
      statusDiv.textContent = 'Error: ' + (data.error || 'Unknown error');
    }
  } catch(e) {
    statusDiv.style.background = '#5c1a1a';
    statusDiv.textContent = 'Network error. Check console.';
    console.error('Sync error:', e);
  }

  setTimeout(function() { statusDiv.remove(); }, 5000);
})();
`;

  return new NextResponse(script.trim(), {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "no-store",
    },
  });
}

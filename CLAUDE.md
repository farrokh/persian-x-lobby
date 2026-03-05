# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start dev server (port 3000)
bun run build    # Production build
bun run lint     # ESLint (flat config, Next.js preset)
```

No test framework is configured.

## Architecture

**Persian X Lobby** is a private community app for Persian tech professionals on X (Twitter). Members join via invite code, sync their X following list, and see who in the group they still need to follow (and vice versa). Email digests nudge members to complete their follows.

### Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Postgres) for database
- Resend for transactional email
- `jose` for JWT auth (HS256, 30-day tokens)
- Deployed on Vercel

### Source Layout (`src/`)

**`lib/`** - Shared utilities:
- `supabase.ts` - Lazy-initialized Supabase clients (anon + service role)
- `auth.ts` - JWT creation/verification, session cookie management, invite code validation
- `email.ts` - Digest email via Resend (lazy client init)
- `bookmarklet.ts` - Generates bookmarklet JS code with embedded user token

**`middleware.ts`** - Protects `/dashboard`, `/sync`, `/matrix`, `/admin` routes via JWT cookie verification

**`app/`** - Pages and API routes:
- `/join`, `/login` - Registration (with invite code) and login
- `/dashboard` - Shows follow completion stats, who to follow, who hasn't followed you
- `/sync` - Bookmarklet distribution page; `/sync/manual` - manual handle paste
- `/matrix` - Grid view of all members' follow relationships
- `/admin` - Admin panel for member management and digest triggers

**API routes** (`app/api/`):
- `auth/` - Register/login (POST with `action: "register"|"login"`)
- `dashboard/`, `matrix/` - Data endpoints for their respective pages
- `sync-receive/` - Bookmarklet redirect target; receives handles via query params, stores in DB
- `sync-manual/` - Manual sync endpoint
- `digest/` - Triggers email digests (protected by `CRON_SECRET` or `ADMIN_SECRET` bearer token)
- `bookmarklet-script/`, `sync-info/` - Support endpoints for sync flow
- `admin/members/`, `admin/digest/` - Admin operations
- `logout/` - Clears session cookie

### Key Design Decisions

**Bookmarklet sync flow**: X's CSP blocks external scripts and fetch requests. The bookmarklet is fully inline JavaScript that auto-scrolls the user's following page, collects handles from the DOM, then navigates to `/api/sync-receive?token=...&handles=...` via URL redirect (no fetch needed). Each user gets a personalized bookmarklet with their JWT embedded.

**Lazy initialization**: Supabase client and Resend are initialized lazily (not at module scope) because Next.js evaluates modules at build time when env vars aren't available.

**Auth model**: Invite-code-based. The same invite code used to register is used to log in (no password). JWT stored in httpOnly session cookie. Admin status is stored in the JWT payload.

### Database Tables (Supabase)
- `members` - id, x_handle, display_name, email, invite_code, is_admin, joined_at
- `follow_relationships` - follower_id (FK to members), following_x_handle, synced_at
- `sync_logs` - member_id, handles_count, synced_at

### Environment Variables
See `.env.local.example` for all required vars. Key ones: Supabase URL/keys, `JWT_SECRET`, `INVITE_CODES` (comma-separated), Resend API key, `CRON_SECRET`/`ADMIN_SECRET` for digest endpoint.

### Path Aliases
`@/*` maps to `./src/*` (configured in tsconfig.json).

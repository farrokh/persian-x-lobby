-- Members table
CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  x_handle text UNIQUE NOT NULL,
  display_name text,
  email text NOT NULL,
  invite_code text NOT NULL,
  is_admin boolean DEFAULT false,
  joined_at timestamptz DEFAULT now()
);

-- Follow relationships table
CREATE TABLE follow_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  following_x_handle text NOT NULL,
  synced_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_x_handle)
);

-- Sync logs table
CREATE TABLE sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  handles_count int NOT NULL,
  synced_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_follow_relationships_follower ON follow_relationships(follower_id);
CREATE INDEX idx_follow_relationships_handle ON follow_relationships(following_x_handle);
CREATE INDEX idx_sync_logs_member ON sync_logs(member_id);
CREATE INDEX idx_members_x_handle ON members(x_handle);

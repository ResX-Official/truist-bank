-- ============================================================
-- Run this in your Supabase SQL Editor
-- Adds: withdrawal_requests, support_messages tables
-- ============================================================

-- WITHDRAWAL REQUESTS
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id       UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  amount           NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  bank_name        TEXT NOT NULL,
  routing_number   TEXT NOT NULL,
  account_number   TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  account_type     TEXT NOT NULL DEFAULT 'checking' CHECK (account_type IN ('checking','savings')),
  note             TEXT,
  otp              TEXT NOT NULL,
  otp_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  status           TEXT NOT NULL DEFAULT 'otp_pending'
                   CHECK (status IN ('pending','otp_pending','processing','completed','rejected','cancelled')),
  admin_note       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_withdrawal_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_withdrawal_updated_at ON withdrawal_requests;
CREATE TRIGGER trg_withdrawal_updated_at
BEFORE UPDATE ON withdrawal_requests
FOR EACH ROW EXECUTE FUNCTION update_withdrawal_updated_at();

-- RLS
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Users can see/create their own requests
CREATE POLICY "Users can view own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawal requests"
  ON withdrawal_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests (cancel/otp)"
  ON withdrawal_requests FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can see and update all requests
CREATE POLICY "Admins can view all withdrawal requests"
  ON withdrawal_requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update any withdrawal request"
  ON withdrawal_requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- SUPPORT MESSAGES
CREATE TABLE IF NOT EXISTS support_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user','admin')),
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Users can see their own messages
CREATE POLICY "Users can view own support messages"
  ON support_messages FOR SELECT
  USING (auth.uid() = user_id);

-- Users can send messages (sender_type = 'user')
CREATE POLICY "Users can insert own messages"
  ON support_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND sender_type = 'user');

-- Admins can see all messages
CREATE POLICY "Admins can view all support messages"
  ON support_messages FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can send messages (sender_type = 'admin')
CREATE POLICY "Admins can insert support messages"
  ON support_messages FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can mark messages as read
CREATE POLICY "Admins can update support messages"
  ON support_messages FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Enable Realtime for live chat
ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE withdrawal_requests;

-- ============================================================
-- FIX: Add 'blocked' to transactions status check constraint
-- (The original schema only had 'pending','completed','failed','flagged')
-- ============================================================
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_status_check
  CHECK (status IN ('pending', 'completed', 'failed', 'flagged', 'blocked'));

-- ============================================================
-- ADMIN CREDENTIALS (hardcoded admin login, separate from Supabase auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_credentials (
  id            SERIAL PRIMARY KEY,
  username      TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: No public access — only service role key can read/write
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Insert default: username=Trust, password=trust@2026
-- SHA-256("trust@2026") = 31cd1485ab3b238613f571fee68f91de40baa3e254fc8787e1901f99dbf1c312
INSERT INTO admin_credentials (id, username, password_hash)
VALUES (1, 'Trust', '31cd1485ab3b238613f571fee68f91de40baa3e254fc8787e1901f99dbf1c312')
ON CONFLICT (id) DO NOTHING;

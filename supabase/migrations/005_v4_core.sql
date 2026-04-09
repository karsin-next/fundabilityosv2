-- ============================================================
-- 005_v4_core.sql
-- V4 Predictive Fundability & Verified Deal Flow Framework
-- ============================================================

-- 1. CLEANUP (Per User Request: Remove existing subscriptions)
DELETE FROM public.subscriptions;

-- 2. ENHANCE PROFILES (Roles)
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'startup' CHECK (role IN ('startup', 'investor', 'admin'));

-- 3. INTEGRATIONS (Live Data Moat - Plaid/LinkedIn Mock)
CREATE TABLE public.integrations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.profiles ON DELETE CASCADE,
  platform     TEXT NOT NULL, -- 'plaid', 'linkedin', 'stripe', 'startup_book'
  status       TEXT DEFAULT 'linked', -- 'linked', 'error', 'expired'
  last_sync_at TIMESTAMPTZ DEFAULT NOW(),
  metadata     JSONB DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- 4. INVESTOR EVALUATIONS (Feedback Loop / Labeling)
CREATE TABLE public.evaluations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id  UUID REFERENCES public.profiles ON DELETE CASCADE, -- User ID of the investor
  startup_id   UUID REFERENCES public.profiles ON DELETE CASCADE, -- User ID of the startup
  decision     TEXT NOT NULL CHECK (decision IN ('pass', 'interested', 'meeting_set', 'invested')),
  reason_code  TEXT, -- 'market_too_small', 'team_missing_tech', 'traction_low', 'cap_table_messy'
  feedback_msg TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INTERNAL MESSAGING (Deal Mediation / Bypass Prevention)
CREATE TABLE public.chats (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id   UUID REFERENCES public.profiles ON DELETE CASCADE,
  investor_id  UUID REFERENCES public.profiles ON DELETE CASCADE, -- Note: Links to profile ID of investor
  status       TEXT DEFAULT 'active',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(startup_id, investor_id)
);

CREATE TABLE public.chat_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id      UUID REFERENCES public.chats ON DELETE CASCADE,
  sender_id    UUID REFERENCES public.profiles ON DELETE CASCADE,
  content      TEXT NOT NULL,
  is_read      BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SECURITY: RLS FOR NEW TABLES
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Integrations: Only own
CREATE POLICY "integrations_select_own" ON public.integrations FOR SELECT USING (auth.uid() = user_id);

-- Evaluations: Shared between investor and startup (REDACTED feedback for startup?)
-- Note: User request says "No contact info", but feedback is "social proof".
CREATE POLICY "evaluations_select_involved" ON public.evaluations 
  FOR SELECT USING (auth.uid() = investor_id OR auth.uid() = startup_id);

-- Chats: Only involved
CREATE POLICY "chats_select_involved" ON public.chats 
  FOR SELECT USING (auth.uid() = startup_id OR auth.uid() = investor_id);

-- Messages: Only involved
CREATE POLICY "chat_messages_select_involved" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chats 
      WHERE chats.id = chat_messages.chat_id 
      AND (chats.startup_id = auth.uid() OR chats.investor_id = auth.uid())
    )
  );

-- 7. REVENUE ENGINE: Update Payment Types & Sub Tiers (Documentation/Constraint only as Stripe is separate)
-- No changes needed to SQL table 'payments' as 'type' is text, but we'll reflect in SRD.

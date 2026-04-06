-- ============================================================
-- FundabilityOS — Evolution Insights Table
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS evolution_insights (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type        TEXT NOT NULL DEFAULT 'scheduled',  -- 'scheduled' | 'manual'
  session_count   INTEGER NOT NULL DEFAULT 0,
  payment_count   INTEGER NOT NULL DEFAULT 0,
  insights        JSONB,           -- { trend, upsell_opportunity, ux_friction }
  raw_stats       JSONB,           -- full raw data passed to Claude
  notification_sent BOOLEAN DEFAULT false,
  analysis_period_start TIMESTAMPTZ,
  analysis_period_end   TIMESTAMPTZ,
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for ordering by time (used in cron to find last run)
CREATE INDEX IF NOT EXISTS evolution_insights_generated_at_idx
  ON evolution_insights (generated_at DESC);

-- RLS: Only service role can read/write this table (admin only)
ALTER TABLE evolution_insights ENABLE ROW LEVEL SECURITY;

-- No public policies — only reachable via SUPABASE_SERVICE_ROLE_KEY

-- ============================================================
-- 20260428000000_dashboard_v2.sql
-- Adds investor-ready report fields and payment type support
-- Additive only — no existing data touched
-- ============================================================

-- Add investor report fields to reports table
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS investor_report_json      JSONB,
  ADD COLUMN IF NOT EXISTS investor_report_html      TEXT,
  ADD COLUMN IF NOT EXISTS investor_report_unlocked  BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS investor_report_pdf_url   TEXT;

-- Add investor report reference to payments table  
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS investor_report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL;

-- Update payment type constraint to include investor_report
ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_type_check;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_type_check
  CHECK (type IN ('report', 'badge_monthly', 'badge_annual', 'addon', 'investor_report'));

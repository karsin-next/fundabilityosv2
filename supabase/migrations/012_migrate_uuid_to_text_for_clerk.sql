-- 1. Drop foreign key constraints that reference profiles.id
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- We need to drop constraints from dependent tables before altering profiles.id
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE public.deck_uploads DROP CONSTRAINT IF EXISTS deck_uploads_user_id_fkey;
ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_user_id_fkey;
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;
ALTER TABLE public.addon_purchases DROP CONSTRAINT IF EXISTS addon_purchases_user_id_fkey;
ALTER TABLE public.analytics_events DROP CONSTRAINT IF EXISTS analytics_events_user_id_fkey;
ALTER TABLE public.audit_log DROP CONSTRAINT IF EXISTS audit_log_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_referred_by_fkey;

-- 2. Alter column types from UUID to TEXT
ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.profiles ALTER COLUMN referred_by TYPE TEXT;
ALTER TABLE public.sessions ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.deck_uploads ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.reports ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.payments ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.subscriptions ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.addon_purchases ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.analytics_events ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.audit_log ALTER COLUMN user_id TYPE TEXT;

-- 3. Re-add foreign key constraints
ALTER TABLE public.sessions ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.deck_uploads ADD CONSTRAINT deck_uploads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.reports ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.payments ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.addon_purchases ADD CONSTRAINT addon_purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.analytics_events ADD CONSTRAINT analytics_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.audit_log ADD CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES public.profiles(id);


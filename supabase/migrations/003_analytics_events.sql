CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  user_email text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.analytics_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  donor_name TEXT,
  donor_message TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert donations (anonymous support)
CREATE POLICY "Anyone can insert donations" 
ON donations FOR INSERT 
TO public
WITH CHECK (true);

-- Users can read their own donations
CREATE POLICY "Users can read own donations" 
ON donations FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

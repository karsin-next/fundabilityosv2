-- ============================================================
-- 006_auth_fixes.sql
-- Fix handle_new_user trigger to capture company_name and referral_code_used
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_referral_code TEXT;
  referrer_uuid UUID := NULL;
BEGIN
  -- Generate unique 8-char referral code
  new_referral_code := upper(substring(encode(gen_random_bytes(6), 'hex') FROM 1 FOR 8));

  -- If the user signed up using a referral code, find the referrer
  IF NEW.raw_user_meta_data->>'referral_code_used' IS NOT NULL THEN
    SELECT id INTO referrer_uuid FROM public.profiles WHERE referral_code = NEW.raw_user_meta_data->>'referral_code_used' LIMIT 1;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, company_name, referral_code, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
    new_referral_code,
    referrer_uuid
  );

  -- If referred, create the generic pending referral record
  IF referrer_uuid IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, referred_id, referral_code, status)
    VALUES (referrer_uuid, NEW.id, NEW.raw_user_meta_data->>'referral_code_used', 'pending');
  END IF;

  RETURN NEW;
END;
$$;

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key to bypass RLS for server-side inserts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event_name, metadata, email } = body;

    const { error } = await supabase
      .from('analytics_events')
      .insert([
        { event_name: event_name || 'unknown_click', user_email: email, metadata: metadata || {} }
      ]);

    if (error) {
      console.warn("Analytics insertion error:", error);
      // Fails silently for the client to not block UI
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function run() {
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: "test@example.com",
    options: {
      redirectTo: "https://www.nextblaze.asia/api/auth/callback",
    },
  });
  console.log(JSON.stringify(data, null, 2));
}

run();

import { createClient } from "@supabase/supabase-js";
import { getSession, useSession } from "next-auth/react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const getSupabase = async () => {
  const session = useSession();

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${session.data?.user.id || ""}`,
      },
    },
  });
};

// Default client for realtime subscriptions
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

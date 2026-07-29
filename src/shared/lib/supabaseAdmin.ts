import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses Row Level Security entirely. Only ever
// import this from server actions ("use server"), Route Handlers, or
// Server Components: Next.js strips that code from the client bundle, so
// the key never reaches the browser. Client components that need direct
// Supabase access must keep using the anon client in "./supabase" instead.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default supabaseAdmin;

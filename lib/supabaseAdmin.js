import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service_role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!serviceRole) {
  // We do not throw here to avoid crashing build if env is not provided during dev
  // The API routes that require it will validate at runtime
}

export const supabaseAdmin = serviceRole
  ? createClient(supabaseUrl, serviceRole)
  : null;








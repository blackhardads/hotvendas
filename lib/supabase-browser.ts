import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Stub used at build time when env vars are not available.
// All auth methods return safe empty results so SSG/SSR doesn't crash.
function makeStub() {
  const noop = async () => ({ data: { user: null, session: null }, error: null });
  return {
    auth: {
      getUser: noop,
      getSession: async () => ({ data: { session: null }, error: null }),
      signUp: noop,
      signInWithPassword: noop,
      signOut: async () => ({ error: null }),
    },
  };
}

export const supabaseBrowser =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : (makeStub() as unknown as ReturnType<typeof createClient>);

import { createClient } from '@supabase/supabase-js'

// Admin client using service role key — NEVER expose to browser
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase environment variables are missing. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.')
  }

  return createClient(url, key, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

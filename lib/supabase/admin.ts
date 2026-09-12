import { createClient } from '@supabase/supabase-js'

// Admin client using service role key — NEVER expose to browser
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  let finalUrl = url?.trim() || ''
  if (finalUrl.endsWith('/')) finalUrl = finalUrl.slice(0, -1)
  if (finalUrl.startsWith('http://')) finalUrl = finalUrl.replace('http://', 'https://')
  
  const finalKey = key?.trim() || ''

  if (!finalUrl || !finalKey) {
    throw new Error('Supabase environment variables are missing. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.')
  }

  return createClient(finalUrl, finalKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    global: {
      headers: {
        apikey: finalKey,
        Authorization: `Bearer ${finalKey}`
      }
    }
    }
  )
}

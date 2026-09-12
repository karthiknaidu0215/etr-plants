import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY

  let finalUrl = url?.trim() || ''
  if (finalUrl.endsWith('/')) finalUrl = finalUrl.slice(0, -1)
  if (finalUrl.startsWith('http://')) finalUrl = finalUrl.replace('http://', 'https://')
  
  const finalKey = key?.trim() || ''

  if (!finalUrl || !finalKey) {
    throw new Error('Supabase environment variables are missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.')
  }

  return createBrowserClient(finalUrl, finalKey, {
    global: {
      headers: {
        apikey: finalKey,
        Authorization: `Bearer ${finalKey}`
      }
    }
  })
}

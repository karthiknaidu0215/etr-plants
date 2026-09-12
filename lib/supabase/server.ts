import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY

  let finalUrl = url?.trim() || ''
  if (finalUrl.endsWith('/')) finalUrl = finalUrl.slice(0, -1)
  if (finalUrl.startsWith('http://')) finalUrl = finalUrl.replace('http://', 'https://')
  
  const finalKey = key?.trim() || ''

  if (!finalUrl || !finalKey) {
    throw new Error('Supabase environment variables are missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.')
  }

  return createServerClient(finalUrl, finalKey, {
    cookies: {
      getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — cookies can't be set
          }
        },
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

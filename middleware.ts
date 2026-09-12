import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY

  let finalUrl = url?.trim() || ''
  if (finalUrl.endsWith('/')) finalUrl = finalUrl.slice(0, -1)
  if (finalUrl.startsWith('http://')) finalUrl = finalUrl.replace('http://', 'https://')
  
  const finalKey = key?.trim() || ''

  if (!finalUrl || !finalKey) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }
    return supabaseResponse
  }

  const supabase = createServerClient(finalUrl, finalKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
    global: { headers: { apikey: finalKey, Authorization: `Bearer ${finalKey}` } }
  })

  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isPublicAdminRoute = ['/admin/login', '/admin/secure-setup', '/admin/forgot-password'].includes(request.nextUrl.pathname)

  if (isAdminRoute && !isPublicAdminRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin/login'
    return NextResponse.redirect(redirectUrl)
  }

  if (isPublicAdminRoute && user && request.nextUrl.pathname === '/admin/login') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

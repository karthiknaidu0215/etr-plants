import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const targetUsername = formData.get('username') as string
    const newPassword = formData.get('password') as string

    if (!targetUsername || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'Invalid input' })
    }

    const cookieStore = cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    // Verify requesting user is super_admin
    const { data: profile } = await supabase.from('admin_profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Forbidden. Super Admin only.' }, { status: 403 })
    }

    // Now proceed with service role to update the target
    const adminClient = createAdminClient()
    const { data: targetProfile } = await adminClient.from('admin_profiles').select('id, role').eq('username', targetUsername).single()
    
    if (!targetProfile) return NextResponse.json({ success: false, error: 'Target admin not found' })
    if (targetProfile.role === 'super_admin') return NextResponse.json({ success: false, error: 'Cannot modify Super Admin' })

    const { error: updateError } = await adminClient.auth.admin.updateUserById(targetProfile.id, { password: newPassword })
    if (updateError) return NextResponse.json({ success: false, error: updateError.message })

    return NextResponse.json({ success: true })

  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message })
  }
}

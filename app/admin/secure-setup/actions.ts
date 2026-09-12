'use server'

import { Client } from 'pg'
import fs from 'fs'
import path from 'path'
import { createAdminClient } from '@/lib/supabase/admin'

export async function runSecureSetup(formData: FormData) {
  try {
    const dbPassword = formData.get('dbPassword') as string
    const admin1Password = formData.get('admin1Password') as string
    const admin1Phone = formData.get('admin1Phone') as string
    const admin2Password = formData.get('admin2Password') as string
    const admin3Password = formData.get('admin3Password') as string

    if (!dbPassword || !admin1Password || !admin1Phone || !admin2Password || !admin3Password) {
      return { success: false, error: 'All fields are required' }
    }

    // 1. Run Migrations
    const dbHost = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '')
    if (!dbHost) return { success: false, error: 'Cannot parse DB host' }
    
    const client = new Client({
      host: `db.${dbHost}.supabase.co`,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: dbPassword,
      ssl: { rejectUnauthorized: false }
    })
    
    client.on('error', (err) => console.error('PG Client Error:', err))
    try {
      await client.connect()
      // Run the initial phase 2 migration if not run yet (idempotent due to IF NOT EXISTS)
      const sqlPath1 = path.join(process.cwd(), 'supabase', 'migrations', '002_add_new_features.sql')
      if (fs.existsSync(sqlPath1)) {
         await client.query(fs.readFileSync(sqlPath1, 'utf8'))
      }
      
      // Run the phase 3 admin auth migration
      const sqlPath2 = path.join(process.cwd(), 'supabase', 'migrations', '003_admin_auth.sql')
      if (fs.existsSync(sqlPath2)) {
         await client.query(fs.readFileSync(sqlPath2, 'utf8'))
      }

      const sqlPath3 = path.join(process.cwd(), 'supabase', 'migrations', '004_fix_rls.sql')
      if (fs.existsSync(sqlPath3)) {
         await client.query(fs.readFileSync(sqlPath3, 'utf8'))
      }

      await client.end()
    } catch (e: unknown) {
      console.error('Migration failed:', e)
      return { success: false, error: 'Migration failed: ' + ((e as Error).message) }
    }

    // 2. Create Admins in Supabase Auth & admin_profiles
    const supabase = createAdminClient()
    
    const admins = [
      { username: 'admin1', password: admin1Password, role: 'super_admin', phone: admin1Phone },
      { username: 'admin2', password: admin2Password, role: 'admin', phone: null },
      { username: 'admin3', password: admin3Password, role: 'admin', phone: null }
    ]

    for (const admin of admins) {
      // Create user using a fake internal domain for email mapping since Supabase Auth expects email
      const email = `${admin.username}@etrplants.internal`
      
      // Check if user exists first to make idempotent
      const { data: existingUser, error: listError } = await supabase.auth.admin.listUsers()
      if (listError || !existingUser) {
        return { success: false, error: 'Failed to list users: ' + (listError?.message || 'No data') }
      }
      let userId = existingUser.users.find(u => u.email === email)?.id

      if (!userId) {
        const { data: newUser, error } = await supabase.auth.admin.createUser({
          email: email,
          password: admin.password,
          email_confirm: true,
          user_metadata: { username: admin.username, role: admin.role }
        })
        if (error) {
          return { success: false, error: `Failed to create ${admin.username}: ${error.message}` }
        }
        userId = newUser.user.id
      } else {
        // Update password if already exists
        await supabase.auth.admin.updateUserById(userId, { password: admin.password })
      }

      // Upsert into admin_profiles using postgres directly to bypass RLS (since we are using service_role but just in case)
      const { error: profileError } = await supabase.from('admin_profiles').upsert({
        id: userId,
        username: admin.username,
        role: admin.role,
        is_active: true,
        recovery_phone: admin.phone
      }, { onConflict: 'id' })

      if (profileError) {
        console.error('Profile error:', profileError)
      }
    }

    // 3. Disable setup (create a lock file)
    fs.writeFileSync(path.join(process.cwd(), 'setup.lock'), 'locked')

    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: ((e as Error).message) }
  }
}

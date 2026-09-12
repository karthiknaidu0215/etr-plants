'use server'

import { Client } from 'pg'
import fs from 'fs'
import path from 'path'
import { createAdminClient } from '@/lib/supabase/admin'

export async function runSecureSetup(formData: FormData) {
  try {
    const dbPassword = formData.get('dbPassword') as string
    const admin1Password = formData.get('admin1Password') as string
    const admin2Password = formData.get('admin2Password') as string
    const admin3Password = formData.get('admin3Password') as string

    if (!dbPassword || !admin1Password || !admin2Password || !admin3Password) {
      return { success: false, error: 'All fields are required' }
    }

    // 1. Run Migrations
    const dbHost = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '')
    if (!dbHost) return { success: false, error: 'Cannot parse DB host' }
    
    // Direct connection to postgres to run DDL
    const directConnectionString = `postgresql://postgres:${dbPassword}@db.${dbHost}.supabase.co:5432/postgres`

    const client = new Client({ connectionString: directConnectionString })
    
    try {
      await client.connect()
      
      const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '002_add_new_features.sql')
      const sql = fs.readFileSync(sqlPath, 'utf8')
      
      await client.query(sql)
      await client.end()
    } catch (e: unknown) {
      console.error('Migration failed:', e)
      return { success: false, error: 'Migration failed: ' + ((e as Error).message) }
    }

    // 2. Create Admins
    const supabase = createAdminClient()
    
    const admins = [
      { email: 'adminrayudu@etrplants.com', password: admin1Password, name: 'Admin 1 (Rayudu)' },
      { email: 'admin2@etrplants.com', password: admin2Password, name: 'Admin 2' },
      { email: 'admin3@etrplants.com', password: admin3Password, name: 'Admin 3' }
    ]

    for (const admin of admins) {
      const { error } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
        user_metadata: { name: admin.name, role: 'admin' }
      })
      if (error && !error.message.includes('already exists')) {
        return { success: false, error: 'Failed to create ' + admin.name + ': ' + error.message }
      }
    }

    // 3. Disable setup (create a lock file)
    fs.writeFileSync(path.join(process.cwd(), 'setup.lock'), 'locked')

    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: ((e as Error).message) }
  }
}


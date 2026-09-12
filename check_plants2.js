const fs = require('fs')
const path = require('path')

const env = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim()
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)[1].trim()

const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(url, key)

async function check() {
  const { data, error } = await supabase.from('plants').select('*')
  console.log('Plants:', data?.length, 'Error:', error?.message)
}
check()

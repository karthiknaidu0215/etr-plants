import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(url, key)

async function check() {
  const { data: p, error: pe } = await supabase.from('plants').select('id').limit(1)
  const { data: c, error: ce } = await supabase.from('categories').select('id').limit(1)
  console.log('Plants:', p?.length, 'Error:', pe?.message)
  console.log('Categories:', c?.length, 'Error:', ce?.message)
}
check()

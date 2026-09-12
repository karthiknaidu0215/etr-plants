const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const url = new URL("https://qurlgrxolwzzdhfgiqka.supabase.co")
const host = "db." + url.hostname

async function test() {
  const client = new Client({
    user: 'postgres',
    password: 'Karthik@19082006',
    host: host,
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  })
  
  try {
    await client.connect()
    console.log('Connected!')
    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '005_website_cms.sql')
    console.log('Running 005...')
    await client.query(fs.readFileSync(sqlPath, 'utf8'))
    console.log('Migration 005 successful!')
  } catch (e) {
    console.log('MIGRATION ERROR:', e)
  } finally {
    await client.end()
  }
}
test()

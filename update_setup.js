const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'app', 'admin', 'secure-setup', 'actions.ts')
let content = fs.readFileSync(p, 'utf8')

content = content.replace(
  "if (fs.existsSync(sqlPath2)) {\n         await client.query(fs.readFileSync(sqlPath2, 'utf8'))\n      }",
  "if (fs.existsSync(sqlPath2)) {\n         await client.query(fs.readFileSync(sqlPath2, 'utf8'))\n      }\n\n      const sqlPath3 = path.join(process.cwd(), 'supabase', 'migrations', '004_fix_rls.sql')\n      if (fs.existsSync(sqlPath3)) {\n         await client.query(fs.readFileSync(sqlPath3, 'utf8'))\n      }"
)

fs.writeFileSync(p, content)
console.log('Setup updated')

const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'app', 'admin', 'layout.tsx')
let content = fs.readFileSync(p, 'utf8')

content = content.replace(
  "if (pathname === '/admin/login') {",
  "if (pathname === '/admin/login' || pathname === '/admin/secure-setup') {"
)

fs.writeFileSync(p, content)
console.log('Admin layout updated')

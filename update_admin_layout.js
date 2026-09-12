const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'app', 'admin', 'layout.tsx')
let content = fs.readFileSync(p, 'utf8')

content = content.replace(
  "{ href: '/admin/settings', label: 'Settings', icon: Settings },",
  "{ href: '/admin/fertilizers', label: 'Fertilizers', icon: Leaf },\n  { href: '/admin/additional-items', label: 'Additional Items', icon: Grid3X3 },\n  { href: '/admin/settings', label: 'Settings', icon: Settings },"
)

fs.writeFileSync(p, content)
console.log('Admin layout updated')

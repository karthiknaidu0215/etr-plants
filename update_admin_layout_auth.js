const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'app', 'admin', 'layout.tsx')
let content = fs.readFileSync(p, 'utf8')

// Add Users icon
content = content.replace(
  'MessageSquare, Settings, LogOut, Menu, X, FileText',
  'MessageSquare, Settings, LogOut, Menu, X, FileText, Users'
)

// Add link
content = content.replace(
  "{ href: '/admin/settings', label: 'Settings', icon: Settings },",
  "{ href: '/admin/admins', label: 'Admin Accounts', icon: Users },\n  { href: '/admin/settings', label: 'Settings', icon: Settings },"
)

// Add forgot password to excluded layout
content = content.replace(
  "if (pathname === '/admin/login' || pathname === '/admin/secure-setup') {",
  "if (pathname === '/admin/login' || pathname === '/admin/secure-setup' || pathname === '/admin/forgot-password') {"
)

fs.writeFileSync(p, content)
console.log('Layout updated')

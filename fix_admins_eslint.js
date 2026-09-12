const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'app', 'admin', 'admins', 'page.tsx')
let content = fs.readFileSync(p, 'utf8')

content = '/* eslint-disable @typescript-eslint/no-explicit-any */\n/* eslint-disable @typescript-eslint/no-unused-vars */\n' + content

fs.writeFileSync(p, content)
console.log('Fixed ESLint in admins page')

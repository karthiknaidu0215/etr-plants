const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'components', 'layout', 'Header.tsx')
let content = fs.readFileSync(p, 'utf8')

// Add Admin Login to CTA section (desktop)
content = content.replace(
  '<ChevronRight className="w-4 h-4" />\n              </Link>',
  '<ChevronRight className="w-4 h-4" />\n              </Link>\n              <Link\n                href="/admin/login"\n                className="hidden lg:inline-flex items-center gap-2 border-2 border-forest-600 text-forest-700 bg-white/90 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-forest-50 transition-all"\n              >\n                Admin Login\n              </Link>'
)

// Add to mobile menu
content = content.replace(
  '</div>\n            <Link',
  '</div>\n            <Link\n              href="/admin/login"\n              className="block mt-4 text-center border-2 border-forest-600 text-forest-700 font-semibold py-3 rounded-xl hover:bg-forest-50 transition-colors"\n            >\n              Admin Login\n            </Link>\n            <Link'
)

fs.writeFileSync(p, content)
console.log('Header updated')

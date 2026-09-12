const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'components', 'planner', 'Step1Land.tsx')
let content = fs.readFileSync(p, 'utf8')

// Clamp input max to 25
content = content.replace(
  /if \(!isNaN\(v\)\) setLandAcres\(v\)/,
  "if (!isNaN(v)) setLandAcres(Math.min(Math.max(v, 1), 25))"
)

// Set input max to 25
content = content.replace(
  /<input\s*type="number"\s*min="1"\s*step="0\.1"\s*value=\{landAcres\}\s*onChange=\{handleInput\}/,
  "<input type=\"number\" min=\"1\" max=\"25\" step=\"0.1\" value={landAcres} onChange={handleInput}"
)

// Set slider max to 25
content = content.replace(
  /<input\s*type="range"\s*min="1"\s*max="50"/,
  "<input type=\"range\" min=\"1\" max=\"25\""
)

// Remove Custom 25+ button
content = content.replace(
  /<button\s*onClick=\{[^}]*\}\s*className=\{`[^`]*`\}\s*>\s*Custom \(25\+\)\s*<\/button>/s,
  ""
)

fs.writeFileSync(p, content)
console.log('Step 1 updated')

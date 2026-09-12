const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'components', 'planner', 'Step4PlantLibrary.tsx')
let content = fs.readFileSync(p, 'utf8')

// Fix missing dependency in useEffect
content = content.replace(
  "}, [])",
  "}, [selectedTypeIds])"
)

fs.writeFileSync(p, content)
console.log('Fixed Step4 dependency')

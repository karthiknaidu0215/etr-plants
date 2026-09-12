const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'components', 'planner', 'Step8Quote.tsx')
let content = fs.readFileSync(p, 'utf8')

content = content.replace(
  /plant_name: sp\.plant\.name,/g,
  "plant_name: sp.plant.name,\n          plant_size: sp.size,"
)

content = content.replace(
  /plantId, sp\.plant\.name, sp\.spacing/g,
  "plantId, sp.plant.name, sp.size, sp.spacing"
)

fs.writeFileSync(p, content)
console.log('Step 8 updated')

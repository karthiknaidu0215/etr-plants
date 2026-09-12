const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'components', 'planner', 'Step7Summary.tsx')
let content = fs.readFileSync(p, 'utf8')

// Add selectedAdditionalItems
content = content.replace(
  'selectedPlants, landAcres',
  'selectedPlants, selectedAdditionalItems, landAcres'
)

// Add size to plant display
content = content.replace(
  /<p className="font-bold text-gray-900">\{sp\.plant\.name\}<\/p>/g,
  '<p className="font-bold text-gray-900">{sp.plant.name} <span className="text-xs text-forest-600 ml-1">Size {sp.size}</span></p>'
)

fs.writeFileSync(p, content)
console.log('Step 7 updated')

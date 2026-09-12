const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'components', 'planner', 'Step4PlantLibrary.tsx')
let content = fs.readFileSync(p, 'utf8')

// Inject selectedTypeIds from usePlannerStore
content = content.replace(
  'const {\n    selectedPlants,\n    addPlant,',
  'const {\n    selectedTypeIds,\n    selectedPlants,\n    addPlant,'
)

// Filter categories
content = content.replace(
  "supabase.from('categories').select('*').eq('is_active', true).order('sort_order').then(({data, error: err}) => {\n      if (!err && data) {\n        setCategories(data)\n        if (data.length > 0) setActiveCategoryId(data[0].id)\n      }\n    })",
  "supabase.from('categories').select('*').eq('is_active', true).order('sort_order').then(({data, error: err}) => {\n      if (!err && data) {\n        // Filter to only those selected in Step 3\n        const filteredCats = data.filter(c => selectedTypeIds.length === 0 || selectedTypeIds.includes(c.id))\n        setCategories(filteredCats)\n        if (filteredCats.length > 0) setActiveCategoryId(filteredCats[0].id)\n      }\n    })"
)

fs.writeFileSync(p, content)
console.log('Step 4 fixed to use selectedTypeIds')

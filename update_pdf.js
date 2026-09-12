const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'lib', 'pdfGenerator.ts')
let content = fs.readFileSync(p, 'utf8')

content = content.replace(
  'const {',
  'const {\n    selectedAdditionalItems,'
)

content = content.replace(
  /pdf\.text\(`- \$\{sp\.plant\.name\} \(\$\{sp\.spacing\} ft\): \$\{sp\.plantCount\} plants`, margin, y\)/g,
  "pdf.text(`- ${sp.plant.name} (Size ${sp.size}, ${sp.spacing} ft): ${sp.plantCount} plants`, margin, y)"
)

content = content.replace(
  /y \+= 8\n  \}\)/g,
  "y += 8\n  })\n\n  if (selectedAdditionalItems.length > 0) {\n    y += 10\n    addText('Additional Items', margin, y, { size: 12, bold: true, color: [30, 60, 40] })\n    y += 8\n    selectedAdditionalItems.forEach(item => {\n      addText(`- ${item.item.name} (${item.quantity} ${item.item.unit})`, margin, y)\n      y += 8\n    })\n  }"
)

fs.writeFileSync(p, content)
console.log('PDF updated')

const fs = require('fs')
const path = require('path')

const file7 = path.join(process.cwd(), 'components', 'planner', 'Step7Summary.tsx')
let c7 = fs.readFileSync(file7, 'utf8')
c7 = c7.replace('selectedAdditionalItems, landAcres', 'landAcres')
fs.writeFileSync(file7, c7)

const filePDF = path.join(process.cwd(), 'lib', 'pdfGenerator.ts')
let cPDF = fs.readFileSync(filePDF, 'utf8')
cPDF = cPDF.replace('selectedAdditionalItems,\n', '')
fs.writeFileSync(filePDF, cPDF)

const file6 = path.join(process.cwd(), 'components', 'planner', 'Step6Calculations.tsx')
let c6 = fs.readFileSync(file6, 'utf8')
c6 = c6.replace(/formatNumber,\s*/, '')
c6 = c6.replace(/Calculator,\s*/, '')
c6 = c6.replace(/Info,\s*/, '')
c6 = c6.replace(/selectedPlants,\s*/, '')
c6 = c6.replace(/plantableAcres,\s*/, '')
c6 = c6.replace(/totalPlants,\s*/, '')
fs.writeFileSync(file6, c6)

const fileUtils = path.join(process.cwd(), 'lib', 'utils.ts')
let cU = fs.readFileSync(fileUtils, 'utf8')
cU = cU.replace('let incomePerPlant', 'const incomePerPlant')
fs.writeFileSync(fileUtils, cU)

console.log('Fixed ESLint issues')

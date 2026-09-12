const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'stores', 'plannerStore.ts')
let content = fs.readFileSync(p, 'utf8')

content = content.replace('setStep: (step: number) => void', 'setCurrentStep: (step: number) => void')
content = content.replace('setStep: (step) => set((s) => { s.currentStep = step }),', 'setCurrentStep: (step) => set((s) => { s.currentStep = step }),')

fs.writeFileSync(p, content)
console.log('Store updated')

const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'stores', 'plannerStore.ts')
let content = fs.readFileSync(p, 'utf8')

// Fix names
content = content.replace('togglePlantationType:', 'toggleType:')
content = content.replace('layoutZones: FarmZone[]', 'farmZones: FarmZone[]')
content = content.replace('addZone: (zone: FarmZone) => void', 'addFarmZone: (zone: FarmZone) => void')
content = content.replace('updateZone: (id: string, zone: Partial<FarmZone>) => void', 'updateFarmZone: (id: string, zone: Partial<FarmZone>) => void')
content = content.replace('removeZone: (id: string) => void', 'deleteFarmZone: (id: string) => void')

content = content.replace('layoutZones: [],', 'farmZones: [],\n    quoteSubmitted: false,\n    leadId: null,')
content = content.replace('setStep: (step: number) => void', 'setCurrentStep: (step: number) => void')
content = content.replace('setEstimationParams: (params: EstimationParams) => void', '')

// Add the missing types
content = content.replace('planId: string | null', 'planId: string | null\n  quoteSubmitted: boolean\n  leadId: string | null\n  setEstimationParams: (params: Partial<EstimationParams>) => void\n  setPlanId: (id: string) => void\n  setQuoteSubmitted: (id: string) => void\n  setLeadId: (id: string) => void\n  toggleType: (id: string) => void\n  farmZones: FarmZone[]\n  addFarmZone: (zone: FarmZone) => void\n  updateFarmZone: (id: string, zone: Partial<FarmZone>) => void\n  deleteFarmZone: (id: string) => void')

// Add the missing functions
content = content.replace('setStep: (step) =>', 'setEstimationParams: (params) => set((s) => { s.estimationParams = { ...s.estimationParams, ...params }; get()._recalculate() }),\n    setPlanId: (id) => set((s) => { s.planId = id }),\n    setQuoteSubmitted: (id) => set((s) => { s.quoteSubmitted = true; s.leadId = id }),\n    setLeadId: (id) => set((s) => { s.leadId = id }),\n    setCurrentStep: (step) =>')

// Fix the implementation of zones
content = content.replace('addZone: (zone) => set((s) => { s.layoutZones.push(zone) }),', 'addFarmZone: (zone) => set((s) => { s.farmZones.push(zone) }),')
content = content.replace('updateZone: (id, updates) => set((s) => {', 'updateFarmZone: (id, updates) => set((s) => {')
content = content.replace('const idx = s.layoutZones.findIndex(z => z.id === id)', 'const idx = s.farmZones.findIndex(z => z.id === id)')
content = content.replace('s.layoutZones[idx] = { ...s.layoutZones[idx], ...updates }', 's.farmZones[idx] = { ...s.farmZones[idx], ...updates }')
content = content.replace('removeZone: (id) => set((s) => {', 'deleteFarmZone: (id) => set((s) => {')
content = content.replace('s.layoutZones = s.layoutZones.filter(z => z.id !== id)', 's.farmZones = s.farmZones.filter(z => z.id !== id)')
content = content.replace('clearZones: () => set((s) => { s.layoutZones = [] }),', 'clearZones: () => set((s) => { s.farmZones = [] }),')
content = content.replace('togglePlantationType: (id) => set((s) => {', 'toggleType: (id) => set((s) => {')

fs.writeFileSync(p, content)
console.log('Store updated again')

const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'stores', 'plannerStore.ts')
let content = fs.readFileSync(p, 'utf8')

// Clean up the duplicates in plannerStore.ts by doing a clean rewrite
// I will just download the original and apply the changes properly or just overwrite the interface
// Wait, I can just rewrite the whole file cleanly

const cleanStore = `
'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  Plant,
  SelectedPlant,
  FarmZone,
  PlanCalculations,
  EstimationParams,
  DEFAULT_ESTIMATION_PARAMS,
  Fertilizer,
  AdditionalItem,
  SelectedAdditionalItem
} from '@/lib/types'
import {
  calculatePlantCount,
  calculatePlan,
  PLANTATION_COLORS,
  generatePlanId,
  SQFT_PER_ACRE,
} from '@/lib/utils'

interface PlannerState {
  currentStep: number
  landAcres: number
  selectedState: string
  selectedDistrict: string
  selectedMandal: string
  selectedTypeIds: string[]
  selectedPlants: SelectedPlant[]
  selectedAdditionalItems: SelectedAdditionalItem[]
  farmZones: FarmZone[]
  calculations: PlanCalculations
  estimationParams: EstimationParams
  planId: string | null
  quoteSubmitted: boolean
  leadId: string | null
  
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setLandAcres: (acres: number) => void
  setLocation: (state: string, dist: string, mandal: string) => void
  toggleType: (id: string) => void
  
  addPlant: (plant: Plant, size: 'S'|'M'|'L') => void
  removePlant: (plantId: string, size: 'S'|'M'|'L') => void
  updatePlantSpacing: (plantId: string, size: 'S'|'M'|'L', spacing: number) => void
  updatePlantAllocation: (plantId: string, size: 'S'|'M'|'L', pct: number) => void
  equalizeAllocations: () => void
  
  addFarmZone: (zone: FarmZone) => void
  updateFarmZone: (id: string, zone: Partial<FarmZone>) => void
  deleteFarmZone: (id: string) => void
  clearZones: () => void
  
  addAdditionalItem: (item: AdditionalItem, quantity: number) => void
  removeAdditionalItem: (itemId: string) => void
  updateAdditionalItemQuantity: (itemId: string, quantity: number) => void
  
  setEstimationParams: (params: Partial<EstimationParams>) => void
  setPlanId: (id: string) => void
  setQuoteSubmitted: (id: string) => void
  setLeadId: (id: string) => void
  
  _recalculate: () => void
}

export const usePlannerStore = create<PlannerState>()(
  immer((set, get) => ({
    currentStep: 1,
    landAcres: 5,
    selectedState: '',
    selectedDistrict: '',
    selectedMandal: '',
    selectedTypeIds: [],
    selectedPlants: [],
    selectedAdditionalItems: [],
    farmZones: [],
    calculations: calculatePlan(5, [], [], DEFAULT_ESTIMATION_PARAMS),
    estimationParams: DEFAULT_ESTIMATION_PARAMS,
    planId: null,
    quoteSubmitted: false,
    leadId: null,

    setCurrentStep: (step) => set((s) => { s.currentStep = step }),
    nextStep: () => set((s) => { s.currentStep += 1 }),
    prevStep: () => set((s) => { s.currentStep = Math.max(1, s.currentStep - 1) }),
    
    setLandAcres: (acres) => {
      set((s) => { s.landAcres = acres })
      get()._recalculate()
    },
    
    setLocation: (state, dist, mandal) => set((s) => {
      s.selectedState = state
      s.selectedDistrict = dist
      s.selectedMandal = mandal
    }),
    
    toggleType: (id) => set((s) => {
      if (s.selectedTypeIds.includes(id)) {
        s.selectedTypeIds = s.selectedTypeIds.filter(x => x !== id)
      } else {
        s.selectedTypeIds.push(id)
      }
    }),
    
    addPlant: (plant, size) => {
      set((s) => {
        const id = plant.id + '-' + size
        const existing = s.selectedPlants.find(p => p.plantId === id)
        if (!existing) {
          s.selectedPlants.push({
            plantId: id,
            plant,
            size,
            spacing: plant.default_spacing,
            allocationPercentage: 0,
            allocatedAcres: 0,
            plantCount: 0,
            plantCost: 0,
            estimatedAnnualIncome: 0,
          })
        }
      })
      get()._recalculate()
    },
    
    removePlant: (plantId, size) => {
      set((s) => {
        const id = plantId + '-' + size
        s.selectedPlants = s.selectedPlants.filter(p => p.plantId !== id)
      })
      get()._recalculate()
    },
    
    updatePlantSpacing: (plantId, size, spacing) => {
      set((s) => {
        const id = plantId + '-' + size
        const p = s.selectedPlants.find(x => x.plantId === id)
        if (p) p.spacing = spacing
      })
      get()._recalculate()
    },
    
    updatePlantAllocation: (plantId, size, pct) => {
      set((s) => {
        const id = plantId + '-' + size
        const p = s.selectedPlants.find(x => x.plantId === id)
        if (p) p.allocationPercentage = pct
      })
      get()._recalculate()
    },
    
    equalizeAllocations: () => {
      set((s) => {
        if (s.selectedPlants.length === 0) return
        const eq = 100 / s.selectedPlants.length
        s.selectedPlants.forEach(p => p.allocationPercentage = eq)
      })
      get()._recalculate()
    },
    
    addFarmZone: (zone) => set((s) => { s.farmZones.push(zone) }),
    updateFarmZone: (id, updates) => set((s) => {
      const idx = s.farmZones.findIndex(z => z.id === id)
      if (idx !== -1) {
        s.farmZones[idx] = { ...s.farmZones[idx], ...updates }
      }
    }),
    deleteFarmZone: (id) => set((s) => {
      s.farmZones = s.farmZones.filter(z => z.id !== id)
    }),
    clearZones: () => set((s) => { s.farmZones = [] }),

    addAdditionalItem: (item, quantity) => {
      set((s) => {
        const existing = s.selectedAdditionalItems.find(x => x.itemId === item.id)
        if (existing) {
          existing.quantity = quantity
        } else {
          s.selectedAdditionalItems.push({
            itemId: item.id,
            item,
            quantity,
            cost: item.price * quantity
          })
        }
      })
      get()._recalculate()
    },
    
    removeAdditionalItem: (itemId) => {
      set((s) => {
        s.selectedAdditionalItems = s.selectedAdditionalItems.filter(x => x.itemId !== itemId)
      })
      get()._recalculate()
    },

    updateAdditionalItemQuantity: (itemId, quantity) => {
      set((s) => {
        const existing = s.selectedAdditionalItems.find(x => x.itemId === itemId)
        if (existing) {
          existing.quantity = quantity
        }
      })
      get()._recalculate()
    },
    
    setEstimationParams: (params) => {
      set((s) => { s.estimationParams = { ...s.estimationParams, ...params } })
      get()._recalculate()
    },
    setPlanId: (id) => set((s) => { s.planId = id }),
    setQuoteSubmitted: (id) => set((s) => { s.quoteSubmitted = true; s.leadId = id }),
    setLeadId: (id) => set((s) => { s.leadId = id }),

    _recalculate: () => {
      set((s) => {
        s.calculations = calculatePlan(s.landAcres, s.selectedPlants, s.selectedAdditionalItems, s.estimationParams)
      })
    },
  }))
)
`

fs.writeFileSync(p, cleanStore)
console.log('Clean store updated')

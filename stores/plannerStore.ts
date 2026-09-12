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
} from '@/lib/types'
import {
  calculatePlantCount,
  calculatePlan,
  PLANTATION_COLORS,
  generatePlanId,
  SQFT_PER_ACRE,
} from '@/lib/utils'

// ── State shape ───────────────────────────────────────────────
interface PlannerState {
  // Navigation
  currentStep: number

  // Step 1: Land
  landAcres: number

  // Step 2: Location
  selectedState: string
  selectedDistrict: string
  selectedMandal: string

  // Step 3: Plantation Types
  selectedTypeIds: string[]

  // Step 4: Plants
  selectedPlants: SelectedPlant[]

  // Step 5: Farm layout zones
  farmZones: FarmZone[]

  // Calculations
  calculations: PlanCalculations
  estimationParams: EstimationParams

  // Plan ID
  planId: string | null

  // Quote form submitted
  quoteSubmitted: boolean
  leadId: string | null
}

// ── Actions shape ─────────────────────────────────────────────
interface PlannerActions {
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  setLandAcres: (acres: number) => void

  setLocation: (state: string, district: string, mandal: string) => void

  toggleType: (typeId: string) => void

  addPlant: (plant: Plant) => void
  removePlant: (plantId: string) => void
  updatePlantSpacing: (plantId: string, spacing: number) => void
  updatePlantAllocation: (plantId: string, percentage: number) => void
  equalizeAllocations: () => void

  setFarmZones: (zones: FarmZone[]) => void
  addFarmZone: (zone: FarmZone) => void
  updateFarmZone: (zoneId: string, updates: Partial<FarmZone>) => void
  deleteFarmZone: (zoneId: string) => void

  setEstimationParams: (params: EstimationParams) => void
  setPlanId: (id: string) => void
  setQuoteSubmitted: (leadId: string) => void

  recalculate: () => void
  reset: () => void
}

type PlannerStore = PlannerState & PlannerActions

// ── Default calculations ──────────────────────────────────────
const defaultCalc: PlanCalculations = {
  totalLandAcres: 1,
  plantableAcres: 0.75,
  usedLandAcres: 0.75,
  remainingLandAcres: 0.25,
  totalPlants: 0,
  plantCost: 0,
  fertilizerCost: 8000,
  setupCost: 25000,
  labourCost: 15000,
  otherCosts: 5000,
  totalInvestment: 53000,
  expectedAnnualIncome: 0,
  allocationValid: true,
  totalAllocationPercent: 0,
}

// ── Default farm zones for 1 acre canvas ─────────────────────
function getDefaultZones(landAcres: number): FarmZone[] {
  return [
    {
      id: 'boundary',
      type: 'boundary',
      label: 'Land Boundary',
      x: 10, y: 10, width: 580, height: 380,
      fill: 'transparent',
      area_acres: landAcres,
    },
    {
      id: 'entrance',
      type: 'entrance',
      label: 'Entrance / Gate',
      x: 260, y: 360, width: 80, height: 30,
      fill: '#f59e0b',
      area_acres: 0.02,
    },
    {
      id: 'farmhouse',
      type: 'farmhouse',
      label: 'Farmhouse',
      x: 450, y: 40, width: 120, height: 90,
      fill: '#8b5e3c',
      area_acres: 0.1,
    },
    {
      id: 'road-main',
      type: 'road',
      label: 'Main Road',
      x: 290, y: 10, width: 20, height: 380,
      fill: '#9ca3af',
      area_acres: 0.05,
    },
  ]
}

// ── Store ─────────────────────────────────────────────────────
export const usePlannerStore = create<PlannerStore>()(
  immer((set, get) => ({
    // Initial state
    currentStep: 1,
    landAcres: 1,
    selectedState: '',
    selectedDistrict: '',
    selectedMandal: '',
    selectedTypeIds: [],
    selectedPlants: [],
    farmZones: getDefaultZones(1),
    calculations: defaultCalc,
    estimationParams: DEFAULT_ESTIMATION_PARAMS,
    planId: null,
    quoteSubmitted: false,
    leadId: null,

    // ── Navigation ─────────────────────────────────────────
    setCurrentStep: (step) => set((s) => { s.currentStep = step }),
    nextStep: () => set((s) => { if (s.currentStep < 8) s.currentStep++ }),
    prevStep: () => set((s) => { if (s.currentStep > 1) s.currentStep-- }),

    // ── Step 1: Land ───────────────────────────────────────
    setLandAcres: (acres) => {
      set((s) => {
        s.landAcres = acres
        s.farmZones = getDefaultZones(acres)
      })
      get().recalculate()
    },

    // ── Step 2: Location ───────────────────────────────────
    setLocation: (state, district, mandal) =>
      set((s) => {
        s.selectedState = state
        s.selectedDistrict = district
        s.selectedMandal = mandal
      }),

    // ── Step 3: Types ──────────────────────────────────────
    toggleType: (typeId) =>
      set((s) => {
        const idx = s.selectedTypeIds.indexOf(typeId)
        if (idx >= 0) {
          s.selectedTypeIds.splice(idx, 1)
        } else {
          s.selectedTypeIds.push(typeId)
        }
      }),

    // ── Step 4: Plants ─────────────────────────────────────
    addPlant: (plant) => {
      const { selectedPlants, selectedTypeIds } = get()
      if (selectedPlants.find((sp) => sp.plantId === plant.id)) return

      const count = selectedPlants.length + 1
      const equalShare = Math.floor(100 / count)

      set((s) => {
        // Rebalance existing plants
        s.selectedPlants.forEach((sp, i) => {
          sp.allocationPercentage = i < count - 1 ? equalShare : 100 - equalShare * (count - 2)
        })

        const newPlant: SelectedPlant = {
          plantId: plant.id,
          plant,
          spacing: plant.default_spacing,
          allocationPercentage: count === 1 ? 100 : equalShare,
          allocatedAcres: 0,
          plantCount: 0,
          plantCost: 0,
          estimatedAnnualIncome: 0,
        }
        s.selectedPlants.push(newPlant)
      })
      get().recalculate()
    },

    removePlant: (plantId) => {
      set((s) => {
        s.selectedPlants = s.selectedPlants.filter((sp) => sp.plantId !== plantId)
        // Remove plantation zones with this plant
        s.farmZones = s.farmZones.filter(
          (z) => !(z.type === 'plantation' && z.plant_id === plantId)
        )
      })
      get().equalizeAllocations()
    },

    updatePlantSpacing: (plantId, spacing) => {
      set((s) => {
        const sp = s.selectedPlants.find((p) => p.plantId === plantId)
        if (sp) sp.spacing = spacing
      })
      get().recalculate()
    },

    updatePlantAllocation: (plantId, percentage) => {
      set((s) => {
        const sp = s.selectedPlants.find((p) => p.plantId === plantId)
        if (sp) sp.allocationPercentage = percentage
      })
      get().recalculate()
    },

    equalizeAllocations: () => {
      const count = get().selectedPlants.length
      if (count === 0) return
      const equalShare = parseFloat((100 / count).toFixed(2))
      set((s) => {
        s.selectedPlants.forEach((sp, i) => {
          sp.allocationPercentage =
            i === count - 1
              ? parseFloat((100 - equalShare * (count - 1)).toFixed(2))
              : equalShare
        })
      })
      get().recalculate()
    },

    // ── Step 5: Farm zones ─────────────────────────────────
    setFarmZones: (zones) => set((s) => { s.farmZones = zones }),

    addFarmZone: (zone) => set((s) => { s.farmZones.push(zone) }),

    updateFarmZone: (zoneId, updates) =>
      set((s) => {
        const z = s.farmZones.find((z) => z.id === zoneId)
        if (z) Object.assign(z, updates)
      }),

    deleteFarmZone: (zoneId) =>
      set((s) => {
        s.farmZones = s.farmZones.filter((z) => z.id !== zoneId)
      }),

    // ── Estimation params ──────────────────────────────────
    setEstimationParams: (params) => {
      set((s) => { s.estimationParams = params })
      get().recalculate()
    },

    // ── Plan / Quote ───────────────────────────────────────
    setPlanId: (id) => set((s) => { s.planId = id }),

    setQuoteSubmitted: (leadId) =>
      set((s) => {
        s.quoteSubmitted = true
        s.leadId = leadId
      }),

    // ── Recalculate ────────────────────────────────────────
    recalculate: () => {
      const { landAcres, selectedPlants, estimationParams } = get()
      const calc = calculatePlan(landAcres, selectedPlants, estimationParams)

      // Update allocated acres and counts on each plant
      const plantableAcres = landAcres * (estimationParams.plantation_area_percent / 100)
      set((s) => {
        s.selectedPlants.forEach((sp) => {
          sp.allocatedAcres = (sp.allocationPercentage / 100) * plantableAcres
          sp.plantCount = calculatePlantCount(sp.allocatedAcres, sp.spacing)
          sp.plantCost = sp.plantCount * sp.plant.price_per_plant

          const ia = sp.plant.income_assumptions
          if (ia?.annual_income_per_plant) {
            sp.estimatedAnnualIncome = sp.plantCount * ia.annual_income_per_plant
          } else if (ia?.yield_kg_per_plant && ia?.price_per_kg) {
            sp.estimatedAnnualIncome = sp.plantCount * ia.yield_kg_per_plant * ia.price_per_kg
          } else {
            sp.estimatedAnnualIncome = 0
          }
        })
        s.calculations = calc
      })
    },

    // ── Reset ──────────────────────────────────────────────
    reset: () =>
      set((s) => {
        s.currentStep = 1
        s.landAcres = 1
        s.selectedState = ''
        s.selectedDistrict = ''
        s.selectedMandal = ''
        s.selectedTypeIds = []
        s.selectedPlants = []
        s.farmZones = getDefaultZones(1)
        s.calculations = defaultCalc
        s.planId = null
        s.quoteSubmitted = false
        s.leadId = null
      }),
  }))
)

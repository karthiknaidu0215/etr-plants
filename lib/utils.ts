import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { EstimationParams, PlanCalculations, SelectedPlant, SelectedAdditionalItem } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return ',10'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(n))
}

export const SQFT_PER_ACRE = 43560

export function acreToSqFt(acres: number): number {
  return acres * SQFT_PER_ACRE
}

export function sqFtToAcre(sqFt: number): number {
  return sqFt / SQFT_PER_ACRE
}

export function calculatePlantCount(allocatedAcres: number, spacingFt: number): number {
  if (spacingFt <= 0 || allocatedAcres <= 0) return 0
  const sqFt = allocatedAcres * SQFT_PER_ACRE
  return Math.floor(sqFt / (spacingFt * spacingFt))
}

export function generatePlanId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `ETR-PLAN-${year}-${random}`
}

export function generateLeadId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `ETR-LEAD-${year}-${random}`
}

export const PLANTATION_COLORS = [
  '#4ade80', '#2dd4bf', '#60a5fa', '#a78bfa',
  '#f472b6', '#fb923c', '#facc15', '#a3e635',
  '#34d399', '#38bdf8', '#818cf8', '#c084fc',
]

export function calculatePlan(
  landAcres: number,
  selectedPlants: SelectedPlant[],
  selectedAdditionalItems: SelectedAdditionalItem[],
  params: EstimationParams
): PlanCalculations {
  const totalAlloc = selectedPlants.reduce((sum, p) => sum + p.allocationPercentage, 0)
  const allocValid = Math.abs(totalAlloc - 100) < 0.1

  let totalPlants = 0
  let plantCost = 0
  let expectedAnnualIncome = 0
  let usedLandAcres = 0

  const plantableAcres = landAcres * (params.plantation_area_percent / 100)

  selectedPlants.forEach((sp) => {
    const allocated = plantableAcres * (sp.allocationPercentage / 100)
    sp.allocatedAcres = allocated
    sp.plantCount = calculatePlantCount(allocated, sp.spacing)
    
    const price = sp.size === 'S' ? (sp.plant.price_s || 0) : sp.size === 'M' ? (sp.plant.price_m || 0) : (sp.plant.price_l || 0)
    sp.plantCost = sp.plantCount * price
    
    const incomePerPlant = sp.plant.income_assumptions?.annual_income_per_plant || 0
    sp.estimatedAnnualIncome = sp.plantCount * incomePerPlant

    totalPlants += sp.plantCount
    plantCost += sp.plantCost
    expectedAnnualIncome += sp.estimatedAnnualIncome
    usedLandAcres += allocated
  })

  const fertilizerCost = landAcres * params.fertilizer_cost_per_acre
  const setupCost = landAcres * params.setup_cost_per_acre

  let labourCost = 0
  let honeyBeeBoxCost = 0
  let otherCosts = landAcres * params.other_costs_per_acre

  selectedAdditionalItems.forEach(item => {
    item.cost = item.quantity * item.item.price
    if (item.item.category === 'labour') {
      labourCost += item.cost
    } else if (item.item.category === 'honey_bee_box') {
      honeyBeeBoxCost += item.cost
    } else {
      otherCosts += item.cost
    }
  })

  const totalInvestment = plantCost + fertilizerCost + setupCost + labourCost + honeyBeeBoxCost + otherCosts

  return {
    totalLandAcres: landAcres,
    plantableAcres,
    usedLandAcres,
    remainingLandAcres: landAcres - usedLandAcres,
    totalPlants,
    plantCost,
    fertilizerCost,
    setupCost,
    labourCost,
    honeyBeeBoxCost,
    otherCosts,
    totalInvestment,
    expectedAnnualIncome,
    allocationValid: allocValid,
    totalAllocationPercent: totalAlloc,
  }
}
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(dateString))
}

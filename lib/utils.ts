import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { EstimationParams, PlanCalculations, SelectedPlant } from './types'

// ── Tailwind class utility ────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Indian currency formatting ────────────────────────────────
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// ── Indian number formatting ──────────────────────────────────
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(n))
}

// ── Area conversions ──────────────────────────────────────────
export const SQFT_PER_ACRE = 43560

export function acreToSqFt(acres: number): number {
  return acres * SQFT_PER_ACRE
}

export function sqFtToAcre(sqFt: number): number {
  return sqFt / SQFT_PER_ACRE
}

// ── Plant count calculation ───────────────────────────────────
// Plants = floor( (acres × 43560) / (spacing × spacing) )
export function calculatePlantCount(allocatedAcres: number, spacingFt: number): number {
  if (spacingFt <= 0 || allocatedAcres <= 0) return 0
  const sqFt = allocatedAcres * SQFT_PER_ACRE
  return Math.floor(sqFt / (spacingFt * spacingFt))
}

// ── Plan ID generation ────────────────────────────────────────
export function generatePlanId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `ETR-PLAN-${year}-${random}`
}

// ── Lead ID generation ────────────────────────────────────────
export function generateLeadId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `ETR-LEAD-${year}-${random}`
}

// ── Full plan calculations ────────────────────────────────────
export function calculatePlan(
  landAcres: number,
  selectedPlants: SelectedPlant[],
  params: EstimationParams
): PlanCalculations {
  const plantableAcres = landAcres * (params.plantation_area_percent / 100)

  let totalPlants = 0
  let plantCost = 0
  let expectedAnnualIncome = 0
  let totalAllocationPercent = 0

  selectedPlants.forEach((sp) => {
    totalAllocationPercent += sp.allocationPercentage
    const allocatedAcres = (sp.allocationPercentage / 100) * plantableAcres
    const plantCount = calculatePlantCount(allocatedAcres, sp.spacing)
    const pCost = plantCount * sp.plant.price_per_plant

    let annualIncome = 0
    if (sp.plant.income_assumptions?.annual_income_per_plant) {
      annualIncome = plantCount * sp.plant.income_assumptions.annual_income_per_plant
    } else if (
      sp.plant.income_assumptions?.yield_kg_per_plant &&
      sp.plant.income_assumptions?.price_per_kg
    ) {
      annualIncome =
        plantCount *
        sp.plant.income_assumptions.yield_kg_per_plant *
        sp.plant.income_assumptions.price_per_kg
    }

    totalPlants += plantCount
    plantCost += pCost
    expectedAnnualIncome += annualIncome

    return { ...sp, allocatedAcres, plantCount, plantCost: pCost, estimatedAnnualIncome: annualIncome }
  })

  const fertilizerCost = landAcres * params.fertilizer_cost_per_acre
  const setupCost = landAcres * params.setup_cost_per_acre
  const labourCost = landAcres * params.labour_cost_per_acre
  const otherCosts = landAcres * params.other_costs_per_acre
  const totalInvestment = plantCost + fertilizerCost + setupCost + labourCost + otherCosts

  const allocationValid = Math.abs(totalAllocationPercent - 100) < 0.01 || selectedPlants.length === 0

  return {
    totalLandAcres: landAcres,
    plantableAcres,
    usedLandAcres: plantableAcres,
    remainingLandAcres: landAcres - plantableAcres,
    totalPlants,
    plantCost,
    fertilizerCost,
    setupCost,
    labourCost,
    otherCosts,
    totalInvestment,
    expectedAnnualIncome,
    allocationValid,
    totalAllocationPercent,
  }
}

// ── Date formatting ───────────────────────────────────────────
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ── Truncate text ─────────────────────────────────────────────
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen) + '...'
}

// ── Zone colors for farm canvas ───────────────────────────────
export const ZONE_COLORS: Record<string, string> = {
  boundary: '#1a4731',
  farmhouse: '#8b5e3c',
  entrance: '#f59e0b',
  road: '#6b7280',
  water: '#3b82f6',
  plantation: '#2d6a4f',
  open: '#d1fae5',
}

// ── Plant category colors ─────────────────────────────────────
export const CATEGORY_COLORS: Record<string, string> = {
  Fruit: '#f97316',
  Wood: '#92400e',
  Avenue: '#7c3aed',
  Flowers: '#ec4899',
  Landscaping: '#10b981',
}

// ── Plantation block colors (for multiple plants on canvas) ──
export const PLANTATION_COLORS = [
  '#2d6a4f', '#52b788', '#1a4731', '#40916c', '#74c69d',
  '#d8f3dc', '#b7e4c7', '#95d5b2', '#27ae60', '#16a085',
]

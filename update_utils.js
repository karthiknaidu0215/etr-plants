const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'lib', 'utils.ts')
let content = fs.readFileSync(p, 'utf8')

// Add SelectedAdditionalItem to imports
content = content.replace('SelectedPlant } from', 'SelectedPlant, SelectedAdditionalItem } from')

const calcFunc = `export function calculatePlan(
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

  // Mutate objects internally for display in store
  selectedPlants.forEach((sp) => {
    const allocated = plantableAcres * (sp.allocationPercentage / 100)
    sp.allocatedAcres = allocated
    sp.plantCount = calculatePlantCount(allocated, sp.spacing)
    
    const price = sp.size === 'S' ? sp.plant.price_s : sp.size === 'M' ? sp.plant.price_m : sp.plant.price_l
    sp.plantCost = sp.plantCount * price
    
    let incomePerPlant = sp.plant.income_assumptions?.annual_income_per_plant || 0
    sp.estimatedAnnualIncome = sp.plantCount * incomePerPlant

    totalPlants += sp.plantCount
    plantCost += sp.plantCost
    expectedAnnualIncome += sp.estimatedAnnualIncome
    usedLandAcres += allocated
  })

  // Basic costs scaling with acres
  const fertilizerCost = landAcres * params.fertilizer_cost_per_acre
  const setupCost = landAcres * params.setup_cost_per_acre

  // Additional items
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
`

content = content.replace(/export function calculatePlan\([\s\S]*?totalAllocationPercent: totalAlloc,\n  \}\n\}/, calcFunc)

fs.writeFileSync(p, content)
console.log('utils.ts updated')

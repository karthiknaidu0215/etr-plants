export interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface PlantFertilizerInfo {
  type: string
  npk_ratio?: string
  frequency: string
  notes?: string
}

export interface PlantMaintenanceInfo {
  pruning?: string
  irrigation?: string
  general?: string
  pest_control?: string
}

export interface PlantIncomeAssumptions {
  annual_income_per_plant?: number
  yield_kg_per_plant?: number
  price_per_kg?: number
  bearing_age_years?: number
  notes?: string
}

export interface Plant {
  id: string
  name: string
  category_id: string
  category?: Category
  description: string | null
  visual_asset_url?: string | null
  top_down_icon_url?: string | null
  default_spacing: number
  min_spacing: number
  max_spacing: number
  price_per_plant: number
  price_s: number
  price_m: number
  price_l: number
  is_s_active: boolean
  is_m_active: boolean
  is_l_active: boolean
  image_url: string | null
  fertilizer_info: PlantFertilizerInfo | null
  maintenance_info: PlantMaintenanceInfo | null
  water_requirement: string | null
  expected_yield: string | null
  income_assumptions: PlantIncomeAssumptions | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Fertilizer {
  id: string
  name: string
  description: string | null
  unit: string
  price_per_unit: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdditionalItem {
  id: string
  category: 'labour' | 'honey_bee_box' | 'other'
  name: string
  description: string | null
  unit: string
  price: number
  is_optional: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Quotation {
  id: string
  quotation_id: string
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
  land_size_acres: number
  location_state: string | null
  location_district: string | null
  location_mandal: string | null
  items_data: Record<string, unknown>
  subtotal: number
  additional_charges: number
  discount: number
  final_amount: number
  notes: string | null
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface IncomeTimeline {
  id: string
  plant_id: string
  period: string
  title: string
  description: string | null
  income_stage: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  state: string
  district: string
  mandal: string | null
  is_active: boolean
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  location: string | null
  land_size_acres: number | null
  plantation_type: string | null
  images: string[] | null
  is_featured: boolean
  sort_order: number
  created_at: string
}

export interface EstimationSetting {
  id: string
  key: string
  value: Record<string, unknown>
  label: string
  description: string | null
  updated_at: string
}

export interface WebsiteSetting {
  id: string
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export interface PlantationPlan {
  id: string
  plan_id: string
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
  land_size_acres: number
  location_state: string | null
  location_district: string | null
  location_mandal: string | null
  plantation_types: string[]
  total_investment: number | null
  expected_income: number | null
  status: 'generated' | 'quote_requested' | 'ordered'
  canvas_data?: string | null
  created_at: string
}

export interface PlantationPlanItem {
  id: string
  plan_id: string
  plant_id: string
  plant?: Plant
  plant_size: 'S' | 'M' | 'L'
  spacing: number
  quantity: number
  land_allocated_acres: number
  allocation_percentage: number
  plant_cost: number
  created_at: string
}

export interface FarmLayout {
  id: string
  plan_id: string
  canvas_data: Record<string, unknown> | null
  zones: FarmZone[]
  total_land_used: number
  created_at: string
  updated_at: string
}

export interface FarmZone {
  id: string
  type: 'boundary' | 'farmhouse' | 'entrance' | 'road' | 'water' | 'irrigation' | 'open' | 'plantation' | 'honey_bee_box'
  label: string
  plant_id?: string
  plant_name?: string
  x: number
  y: number
  width: number
  height: number
  fill: string
  area_acres: number
  rotation?: number
}

export interface Lead {
  id: string
  lead_id: string
  plan_id: string | null
  plantation_plan?: PlantationPlan
  customer_name: string
  customer_phone: string
  customer_email: string | null
  location_state: string | null
  location_district: string | null
  location_mandal: string | null
  land_size_acres: number | null
  selected_plants: SelectedPlantSummary[] | null
  message: string | null
  status: 'new' | 'contacted' | 'in_progress' | 'converted' | 'closed'
  notes: string | null
  intent: 'quote' | 'order'
  created_at: string
  updated_at: string
}

export interface SelectedPlantSummary {
  plant_id: string
  plant_name: string
  plant_size: 'S' | 'M' | 'L'
  spacing: number
  quantity: number
  allocation_percentage: number
  allocated_acres: number
}

// ============================================================
// Planner State Types
// ============================================================

export interface SelectedPlant {
  plantId: string
  plant: Plant
  size: 'S' | 'M' | 'L'
  spacing: number
  allocationPercentage: number
  allocatedAcres: number
  plantCount: number
  plantCost: number
  estimatedAnnualIncome: number
}

export interface SelectedAdditionalItem {
  itemId: string
  item: AdditionalItem
  quantity: number
  cost: number
}

export interface PlanCalculations {
  totalLandAcres: number
  plantableAcres: number
  usedLandAcres: number
  remainingLandAcres: number
  totalPlants: number
  plantCost: number
  fertilizerCost: number
  setupCost: number
  labourCost: number
  honeyBeeBoxCost: number
  otherCosts: number
  totalInvestment: number
  expectedAnnualIncome: number
  allocationValid: boolean
  totalAllocationPercent: number
}

export interface EstimationParams {
  setup_cost_per_acre: number
  labour_cost_per_acre: number
  fertilizer_cost_per_acre: number
  other_costs_per_acre: number
  plantation_area_percent: number
}

export const DEFAULT_ESTIMATION_PARAMS: EstimationParams = {
  setup_cost_per_acre: 25000,
  labour_cost_per_acre: 15000,
  fertilizer_cost_per_acre: 8000,
  other_costs_per_acre: 5000,
  plantation_area_percent: 75,
}



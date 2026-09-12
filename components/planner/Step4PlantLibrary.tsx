'use client'

import { useEffect, useState, useMemo } from 'react'
import { usePlannerStore } from '@/stores/plannerStore'
import { createClient } from '@/lib/supabase/client'
import { Plant, SelectedPlant } from '@/lib/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Leaf, Search, Plus, Minus, Trash2, Loader2, AlertTriangle, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Step4PlantLibrary() {
  const {
    selectedTypeIds, selectedPlants,
    addPlant, removePlant, updatePlantSpacing, updatePlantAllocation, equalizeAllocations,
    calculations,
  } = usePlannerStore()

  const [allPlants, setAllPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'spacing'>('name')

  useEffect(() => {
    const supabase = createClient()
    let query = supabase
      .from('plants')
      .select('*, category:categories(id, name)')
      .eq('is_active', true)

    if (selectedTypeIds.length > 0) {
      query = query.in('category_id', selectedTypeIds)
    }

    query.then(({ data, error: err }) => {
      setLoading(false)
      if (err) setError(true)
      else setAllPlants(data || [])
    })
  }, [selectedTypeIds])

  const filtered = useMemo(() => {
    let list = [...allPlants]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      if (sortBy === 'price') return a.price_per_plant - b.price_per_plant
      if (sortBy === 'spacing') return a.default_spacing - b.default_spacing
      return a.name.localeCompare(b.name)
    })
    return list
  }, [allPlants, search, sortBy])

  const isSelected = (id: string) => selectedPlants.some((sp) => sp.plantId === id)
  const totalAlloc = selectedPlants.reduce((s, sp) => s + sp.allocationPercentage, 0)
  const allocValid = Math.abs(totalAlloc - 100) < 0.1 || selectedPlants.length === 0

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-7 h-7 text-forest-700" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Choose Your Plants</h2>
        <p className="text-gray-500">Select plants and set spacing — plant count updates live</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Plant catalog */}
        <div className="lg:col-span-3">
          {/* Search + sort */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search plants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'spacing')}
                className="pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none appearance-none bg-white"
              >
                <option value="name">Sort: Name</option>
                <option value="price">Sort: Price</option>
                <option value="spacing">Sort: Spacing</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading plants…</span>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-8">Unable to load plant data. Please try again.</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Leaf className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No plants found{search ? ` for "${search}"` : ''}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filtered.map((plant) => {
                const sel = isSelected(plant.id)
                return (
                  <div
                    key={plant.id}
                    className={cn(
                      'bg-white border-2 rounded-2xl p-4 transition-all',
                      sel ? 'border-forest-700 shadow-md' : 'border-gray-100 hover:border-gray-200'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Thumb */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                        {plant.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={plant.image_url} alt={plant.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-forest-50 flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-forest-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm leading-tight">{plant.name}</p>
                        <p className="text-xs text-gray-500 mb-1">
                          Spacing: {plant.default_spacing} ft &bull; {formatCurrency(plant.price_per_plant)}/plant
                        </p>
                        {plant.income_assumptions?.annual_income_per_plant && (
                          <p className="text-xs text-green-600 font-medium">
                            Est. income: {formatCurrency(plant.income_assumptions.annual_income_per_plant)}/plant/yr
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => sel ? removePlant(plant.id) : addPlant(plant)}
                      className={cn(
                        'mt-3 w-full py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1',
                        sel
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                          : 'bg-forest-700 text-white hover:bg-forest-800'
                      )}
                    >
                      {sel ? (
                        <><Minus className="w-3.5 h-3.5" /> Remove</>
                      ) : (
                        <><Plus className="w-3.5 h-3.5" /> Add Plant</>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Selected plants panel */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 sticky top-36">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Selected Plants</h3>
              {selectedPlants.length > 1 && (
                <button
                  onClick={equalizeAllocations}
                  className="text-xs text-forest-700 font-medium hover:underline"
                >
                  Auto-distribute
                </button>
              )}
            </div>

            {selectedPlants.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Leaf className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No plants selected yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPlants.map((sp) => (
                  <SelectedPlantRow
                    key={sp.plantId}
                    sp={sp}
                    onRemove={() => removePlant(sp.plantId)}
                    onSpacingChange={(v) => updatePlantSpacing(sp.plantId, v)}
                    onAllocChange={(v) => updatePlantAllocation(sp.plantId, v)}
                  />
                ))}

                {/* Allocation total */}
                <div className={cn(
                  'flex items-center justify-between p-3 rounded-xl text-sm font-semibold border',
                  allocValid
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                )}>
                  {!allocValid && <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>
                    Total allocation: {totalAlloc.toFixed(0)}%
                    {!allocValid && ' (must equal 100%)'}
                  </span>
                </div>

                {/* Summary */}
                <div className="pt-3 border-t border-gray-200 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total plants:</span>
                    <span className="font-bold">{formatNumber(calculations.totalPlants)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plant cost:</span>
                    <span className="font-bold text-forest-700">{formatCurrency(calculations.plantCost)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SelectedPlantRow({
  sp, onRemove, onSpacingChange, onAllocChange,
}: {
  sp: SelectedPlant
  onRemove: () => void
  onSpacingChange: (v: number) => void
  onAllocChange: (v: number) => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-bold text-sm text-gray-900">{sp.plant.name}</p>
        <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Spacing */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Spacing</span>
          <span className="font-bold text-gray-800">{sp.spacing} ft</span>
        </div>
        <input
          type="range"
          min={sp.plant.min_spacing || 3}
          max={sp.plant.max_spacing || 20}
          step={1}
          value={sp.spacing}
          onChange={(e) => onSpacingChange(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
          <span>{sp.plant.min_spacing || 3} ft</span>
          <span>{sp.plant.max_spacing || 20} ft</span>
        </div>
      </div>

      {/* Allocation */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Land allocation</span>
          <span className="font-bold text-gray-800">{sp.allocationPercentage.toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min={5}
          max={100}
          step={5}
          value={sp.allocationPercentage}
          onChange={(e) => onAllocChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-forest-50 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-500">Plants</p>
          <p className="font-black text-forest-700">{formatNumber(sp.plantCount)}</p>
        </div>
        <div className="bg-forest-50 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-500">Cost</p>
          <p className="font-black text-forest-700 text-xs">{formatCurrency(sp.plantCost)}</p>
        </div>
      </div>
    </div>
  )
}

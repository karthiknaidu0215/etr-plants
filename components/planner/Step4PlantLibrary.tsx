'use client'

import { useEffect, useState, useMemo } from 'react'
import { usePlannerStore } from '@/stores/plannerStore'
import { createClient } from '@/lib/supabase/client'
import { Plant, SelectedPlant } from '@/lib/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Leaf, Search, Trash2, Loader2, AlertTriangle, SlidersHorizontal } from 'lucide-react'
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

    query.then(({ data, error }) => {
      if (error) {
        console.error('Error fetching plants:', error)
        setError(true)
      } else {
        setAllPlants(data as Plant[])
      }
      setLoading(false)
    })
  }, [selectedTypeIds])

  const filtered = useMemo(() => {
    return allPlants
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'price') return (a.price_m || 0) - (b.price_m || 0)
        if (sortBy === 'spacing') return a.default_spacing - b.default_spacing
        return 0
      })
  }, [allPlants, search, sortBy])

  const isSelected = (id: string, size: 'S'|'M'|'L') => selectedPlants.some((p) => p.plantId === id + '-' + size)

  const allocValid = calculations.allocationValid
  const totalAlloc = calculations.totalAllocationPercent

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Select Plants & Quantities</h2>
        <p className="text-gray-500 mt-1">Choose the specific plants and their sizes for your farm.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left: Library */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search plants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'spacing')}
                className="pl-8 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 appearance-none"
              >
                <option value="name">Name A-Z</option>
                <option value="price">Lowest Price</option>
                <option value="spacing">Tightest Spacing</option>
              </select>
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-forest-600">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm font-medium">Loading library...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Failed to load plant library.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-200 dashed">
              <p>No plants found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((plant) => {
                return (
                  <div key={plant.id} className="bg-white border-2 border-gray-100 hover:border-gray-200 rounded-2xl p-4 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                        {plant.image_url ? (
                          <img src={plant.image_url} alt={plant.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-forest-50 flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-forest-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm leading-tight">{plant.name}</p>
                        <p className="text-xs text-gray-500 mb-1">Spacing: {plant.default_spacing} ft</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      {plant.is_s_active && (
                        <PlantSizeOption plant={plant} size="S" price={plant.price_s} isSelected={isSelected(plant.id, 'S')} addPlant={addPlant} removePlant={removePlant} />
                      )}
                      {plant.is_m_active && (
                        <PlantSizeOption plant={plant} size="M" price={plant.price_m} isSelected={isSelected(plant.id, 'M')} addPlant={addPlant} removePlant={removePlant} />
                      )}
                      {plant.is_l_active && (
                        <PlantSizeOption plant={plant} size="L" price={plant.price_l} isSelected={isSelected(plant.id, 'L')} addPlant={addPlant} removePlant={removePlant} />
                      )}
                    </div>
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
                <button onClick={equalizeAllocations} className="text-xs text-forest-700 font-medium hover:underline">
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
                  <SelectedPlantRow key={sp.plantId} sp={sp} onRemove={() => removePlant(sp.plant.id, sp.size)} onSpacingChange={(v) => updatePlantSpacing(sp.plant.id, sp.size, v)} onAllocChange={(v) => updatePlantAllocation(sp.plant.id, sp.size, v)} />
                ))}

                <div className={cn('flex items-center justify-between p-3 rounded-xl text-sm font-semibold border', allocValid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700')}>
                  {!allocValid && <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>Total allocation: {totalAlloc.toFixed(0)}%{!allocValid && ' (must equal 100%)'}</span>
                </div>

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

function PlantSizeOption({ plant, size, price, isSelected, addPlant, removePlant }: { plant: Plant, size: 'S'|'M'|'L', price: number, isSelected: boolean, addPlant: (p: Plant, s: 'S'|'M'|'L') => void, removePlant: (id: string, s: 'S'|'M'|'L') => void }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-800">Size {size}</span>
        <span className="text-xs font-semibold text-forest-600">{formatCurrency(price)}/ea</span>
      </div>
      <button
        onClick={() => isSelected ? removePlant(plant.id, size) : addPlant(plant, size)}
        className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-all", isSelected ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-forest-600 text-white hover:bg-forest-700")}
      >
        {isSelected ? "Remove" : "Select"}
      </button>
    </div>
  )
}

function SelectedPlantRow({ sp, onRemove, onSpacingChange, onAllocChange }: { sp: SelectedPlant, onRemove: () => void, onSpacingChange: (v: number) => void, onAllocChange: (v: number) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-sm text-gray-900">{sp.plant.name}</p>
          <p className="text-xs text-forest-600 font-semibold">Size {sp.size}</p>
        </div>
        <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Spacing</span>
          <span className="font-bold text-gray-800">{sp.spacing} ft</span>
        </div>
        <input type="range" min={sp.plant.min_spacing || 3} max={sp.plant.max_spacing || 20} step={1} value={sp.spacing} onChange={(e) => onSpacingChange(parseFloat(e.target.value))} className="w-full" />
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Land allocation</span>
          <span className="font-bold text-gray-800">{sp.allocationPercentage.toFixed(0)}%</span>
        </div>
        <input type="range" min={0} max={100} step={5} value={sp.allocationPercentage} onChange={(e) => onAllocChange(parseFloat(e.target.value))} className="w-full" />
      </div>

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


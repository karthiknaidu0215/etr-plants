'use client'

import { usePlannerStore } from '@/stores/plannerStore'
import { Leaf } from 'lucide-react'

export default function Step7Summary() {
  const { selectedPlants, landAcres, selectedState, selectedDistrict, selectedMandal, calculations, planId } = usePlannerStore()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-7 h-7 text-forest-700" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Plantation Plan Summary</h2>
        {planId && (
          <div className="inline-block bg-forest-50 border border-forest-200 rounded-xl px-4 py-2 mt-2">
            <span className="text-xs text-forest-600">Plan ID: </span>
            <span className="font-bold text-forest-800">{planId}</span>
          </div>
        )}
      </div>

      <div className="space-y-5" id="plan-summary">
        {/* Overview */}
        <div className="bg-forest-900 text-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <p className="text-white/60 text-xs">ETR Plants</p>
              <p className="font-bold text-lg">Plantation Planning Report</p>
            </div>
            {planId && <span className="ml-auto text-xs text-white/50">{planId}</span>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-white/60 text-xs mb-1">Land Size</p>
              <p className="font-bold">{landAcres} Acres</p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Location</p>
              <p className="font-bold text-sm">
                {[selectedMandal, selectedDistrict, selectedState].filter(Boolean).join(', ') || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Total Plants</p>
              <p className="font-bold">{calculations.totalPlants.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Selected Plants */}
        {selectedPlants.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
            <h3 className="font-bold text-gray-800 mb-4">Selected Plants</h3>
            <div className="space-y-3">
              {selectedPlants.map((sp) => (
                <div key={sp.plantId} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                  <div>
                    <p className="font-semibold text-gray-900">{sp.plant.name}</p>
                    <p className="text-xs text-gray-500">
                      Spacing: {sp.spacing} ft &bull; {sp.allocationPercentage.toFixed(0)}% land ({sp.allocatedAcres.toFixed(2)} acres)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-forest-700">{sp.plantCount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500">plants</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fertilizer & Maintenance */}
        {selectedPlants.some((sp) => sp.plant.fertilizer_info || sp.plant.maintenance_info) && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
            <h3 className="font-bold text-gray-800 mb-4">Fertilizer & Maintenance Plan</h3>
            <div className="space-y-4">
              {selectedPlants.map((sp) => (
                <div key={sp.plantId} className="border border-gray-100 rounded-xl p-4">
                  <p className="font-bold text-gray-900 mb-2">{sp.plant.name}</p>
                  {sp.plant.fertilizer_info && (
                    <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                      <div>
                        <p className="text-xs text-gray-500">Fertilizer Type</p>
                        <p className="font-medium">{sp.plant.fertilizer_info.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Frequency</p>
                        <p className="font-medium">{sp.plant.fertilizer_info.frequency}</p>
                      </div>
                    </div>
                  )}
                  {sp.plant.maintenance_info?.general && (
                    <p className="text-xs text-gray-600 mt-1">{sp.plant.maintenance_info.general}</p>
                  )}
                  {sp.plant.water_requirement && (
                    <p className="text-xs text-blue-600 mt-1">💧 {sp.plant.water_requirement}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
          <h3 className="font-bold text-gray-800 mb-4">Financial Summary</h3>
          <div className="space-y-2 mb-4">
            {[
              { label: 'Plant Cost', value: calculations.plantCost },
              { label: 'Fertilizer Cost', value: calculations.fertilizerCost },
              { label: 'Setup Cost', value: calculations.setupCost },
              { label: 'Labour Cost', value: calculations.labourCost },
              { label: 'Other Costs', value: calculations.otherCosts },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
              <span>Total Investment</span>
              <span className="text-forest-700">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(calculations.totalInvestment)}
              </span>
            </div>
          </div>
          {calculations.expectedAnnualIncome > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs text-green-700 mb-1">Estimated Annual Income</p>
              <p className="text-2xl font-black text-green-700">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(calculations.expectedAnnualIncome)}
              </p>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Income figures are estimates based on configured assumptions and may vary depending on climate, soil, maintenance, yield and market conditions.
          </p>
        </div>
      </div>
    </div>
  )
}

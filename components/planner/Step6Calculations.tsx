'use client'

import { usePlannerStore } from '@/stores/plannerStore'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Calculator, TrendingUp, AlertCircle, Info } from 'lucide-react'

export default function Step6Calculations() {
  const { calculations, selectedPlants, landAcres } = usePlannerStore()

  const {
    plantableAcres,
    totalPlants, plantCost, fertilizerCost, setupCost, labourCost, otherCosts,
    totalInvestment, expectedAnnualIncome, allocationValid,
  } = calculations

  const CalcCard = ({
    label, value, highlight, sub,
  }: {
    label: string; value: string; highlight?: boolean; sub?: string
  }) => (
    <div
      className={`rounded-xl p-5 border ${
        highlight
          ? 'bg-forest-700 border-forest-700 text-white'
          : 'bg-white border-gray-100 shadow-card'
      }`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${highlight ? 'text-white/70' : 'text-gray-500'}`}>
        {label}
      </p>
      <p className={`text-xl font-black ${highlight ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{sub}</p>}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-7 h-7 text-forest-700" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Investment Summary</h2>
        <p className="text-gray-500">Live calculations based on your selections</p>
      </div>

      {!allocationValid && selectedPlants.length > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Plant allocations don&apos;t total 100% — calculations may be inaccurate. Go back to adjust allocations.
        </div>
      )}

      {/* Section 1: Land & Plants */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 mb-5">
        <h3 className="font-bold text-gray-800 mb-4">Land & Plant Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <CalcCard label="Total Land" value={`${landAcres} Acres`} sub={`${formatNumber(landAcres * 43560)} sq ft`} />
          <CalcCard label="Plantation Area (75%)" value={`${plantableAcres.toFixed(2)} Acres`} />
          <CalcCard label="Total Plants" value={formatNumber(totalPlants)} />
          <CalcCard label="Plant Cost" value={formatCurrency(plantCost)} />
        </div>

        {selectedPlants.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs">
                  <th className="text-left pb-2 font-semibold">Plant</th>
                  <th className="text-right pb-2 font-semibold">Spacing</th>
                  <th className="text-right pb-2 font-semibold">Allocation</th>
                  <th className="text-right pb-2 font-semibold">Acres</th>
                  <th className="text-right pb-2 font-semibold">Plants</th>
                  <th className="text-right pb-2 font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody>
                {selectedPlants.map((sp) => (
                  <tr key={sp.plantId} className="border-b border-gray-50">
                    <td className="py-2 font-medium text-gray-900">{sp.plant.name}</td>
                    <td className="py-2 text-right text-gray-600">{sp.spacing} ft</td>
                    <td className="py-2 text-right text-gray-600">{sp.allocationPercentage.toFixed(0)}%</td>
                    <td className="py-2 text-right text-gray-600">{sp.allocatedAcres.toFixed(2)}</td>
                    <td className="py-2 text-right font-bold">{formatNumber(sp.plantCount)}</td>
                    <td className="py-2 text-right font-bold text-forest-700">{formatCurrency(sp.plantCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Investment Breakdown */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 mb-5">
        <h3 className="font-bold text-gray-800 mb-4">Investment Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          <CalcCard label="Plant Cost" value={formatCurrency(plantCost)} />
          <CalcCard label="Fertilizer Cost" value={formatCurrency(fertilizerCost)} sub="Per admin config/acre" />
          <CalcCard label="Setup Cost" value={formatCurrency(setupCost)} sub="Per admin config/acre" />
          <CalcCard label="Labour Cost" value={formatCurrency(labourCost)} sub="Per admin config/acre" />
          <CalcCard label="Other Costs" value={formatCurrency(otherCosts)} sub="Per admin config/acre" />
        </div>
        <CalcCard
          label="TOTAL ESTIMATED INVESTMENT"
          value={formatCurrency(totalInvestment)}
          highlight
          sub="Plant + Fertilizer + Setup + Labour + Other costs"
        />
        <p className="text-xs text-gray-400 mt-3 flex items-start gap-1">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          Cost parameters (fertilizer, setup, labour per acre) are configurable by admin and reflect current settings.
        </p>
      </div>

      {/* Section 3: Expected Income */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-gray-800">Expected Income Estimate</h3>
        </div>

        {selectedPlants.every((sp) => sp.estimatedAnnualIncome === 0) ? (
          <p className="text-gray-500 text-sm">Estimate unavailable — income data not configured for selected plants.</p>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-xs">
                    <th className="text-left pb-2 font-semibold">Plant</th>
                    <th className="text-right pb-2 font-semibold">Plants</th>
                    <th className="text-right pb-2 font-semibold">Est. Annual Income</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPlants.map((sp) => (
                    <tr key={sp.plantId} className="border-b border-gray-50">
                      <td className="py-2 font-medium text-gray-900">{sp.plant.name}</td>
                      <td className="py-2 text-right">{formatNumber(sp.plantCount)}</td>
                      <td className="py-2 text-right font-bold text-green-600">
                        {sp.estimatedAnnualIncome > 0 ? formatCurrency(sp.estimatedAnnualIncome) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CalcCard
              label="Total Estimated Annual Income"
              value={expectedAnnualIncome > 0 ? formatCurrency(expectedAnnualIncome) : 'Estimate unavailable'}
              highlight={expectedAnnualIncome > 0}
            />
          </>
        )}

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700 leading-relaxed">
          <strong>Disclaimer:</strong> Income figures are estimates based on configured assumptions and may vary depending on climate, soil, maintenance, yield and market conditions. ETR Plants does not guarantee any income figures.
        </div>
      </div>
    </div>
  )
}

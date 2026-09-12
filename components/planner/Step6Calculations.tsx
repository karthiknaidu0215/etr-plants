/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
﻿'use client'

import { useEffect, useState } from 'react'
import { usePlannerStore } from '@/stores/plannerStore'
import { createClient } from '@/lib/supabase/client'
import { AdditionalItem } from '@/lib/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { TrendingUp, AlertCircle, Plus, Minus } from 'lucide-react'

export default function Step6Calculations() {
  const {
    calculations, landAcres,
    selectedAdditionalItems, addAdditionalItem, removeAdditionalItem, updateAdditionalItemQuantity
  } = usePlannerStore()

  const [dbItems, setDbItems] = useState<AdditionalItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('additional_items').select('*').eq('is_active', true).then(({ data }) => {
      if (data) setDbItems(data as AdditionalItem[])
      setLoading(false)
    })
  }, [])

  const {
    plantCost, fertilizerCost, setupCost, labourCost, honeyBeeBoxCost, otherCosts,
    totalInvestment, expectedAnnualIncome, allocationValid,
  } = calculations

  const CalcCard = ({ label, value, highlight, sub }: { label: string; value: string; highlight?: boolean; sub?: string }) => (
    <div className={`rounded-xl p-5 border ${highlight ? 'bg-forest-700 border-forest-700 text-white' : 'bg-white border-gray-100 shadow-card'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${highlight ? 'text-white/70' : 'text-gray-500'}`}>{label}</p>
      <p className={`text-2xl font-black ${highlight ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      {sub && <p className={`text-xs mt-2 ${highlight ? 'text-white/80' : 'text-gray-400'}`}>{sub}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Cost & Income Calculations</h2>
        <p className="text-gray-500 mt-1">Review your estimated investment and potential returns.</p>
      </div>

      {!allocationValid && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Your land allocation does not equal 100%. Please return to Step 4 and adjust your plant allocations for accurate calculations.</p>
        </div>
      )}

      {/* Additional Items Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
        <h3 className="font-bold text-gray-800 mb-4">Optional & Additional Items</h3>
        {loading ? <p className="text-sm text-gray-500">Loading options...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbItems.map(item => {
              const selected = selectedAdditionalItems.find(x => x.itemId === item.id)
              const isSelected = !!selected
              // Default quantity logic: if unit is 'per acre', default to landAcres
              const defaultQty = item.unit.includes('acre') ? landAcres : 1

              return (
                <div key={item.id} className={`p-4 border rounded-xl flex flex-col justify-between ${isSelected ? 'border-forest-500 bg-forest-50' : 'border-gray-200'}`}>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                    <p className="text-sm font-semibold text-forest-700">{formatCurrency(item.price)} <span className="text-xs text-gray-500 font-normal">/ {item.unit}</span></p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    {isSelected ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-forest-300 rounded-lg bg-white">
                          <button onClick={() => updateAdditionalItemQuantity(item.id, Math.max(1, selected.quantity - 1))} className="px-2 py-1 text-forest-700 hover:bg-forest-100 rounded-l-lg"><Minus className="w-4 h-4" /></button>
                          <span className="px-2 text-sm font-bold w-12 text-center">{selected.quantity}</span>
                          <button onClick={() => updateAdditionalItemQuantity(item.id, selected.quantity + 1)} className="px-2 py-1 text-forest-700 hover:bg-forest-100 rounded-r-lg"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => removeAdditionalItem(item.id)} className="text-xs text-red-500 font-semibold hover:underline">Remove</button>
                      </div>
                    ) : (
                      <button onClick={() => addAdditionalItem(item, defaultQty)} className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                        Add to Estimate
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 mb-5">
        <h3 className="font-bold text-gray-800 mb-4">Investment Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          <CalcCard label="Plant Cost" value={formatCurrency(plantCost)} />
          <CalcCard label="Fertilizer Cost" value={formatCurrency(fertilizerCost)} sub="Per admin config" />
          <CalcCard label="Setup Cost" value={formatCurrency(setupCost)} sub="Per admin config" />
          <CalcCard label="Labour Cost" value={formatCurrency(labourCost)} sub="Selected optional items" />
          <CalcCard label="Honey Bee Box" value={formatCurrency(honeyBeeBoxCost)} sub="Selected optional items" />
          <CalcCard label="Other Costs" value={formatCurrency(otherCosts)} sub="Base + Selected items" />
        </div>
        <CalcCard label="TOTAL ESTIMATED INVESTMENT" value={formatCurrency(totalInvestment)} highlight sub="Plant + Fertilizer + Setup + Labour + Bee Box + Other costs" />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-gray-800">Expected Income Estimate</h3>
        </div>
        <CalcCard label="Total Estimated Annual Income" value={expectedAnnualIncome > 0 ? formatCurrency(expectedAnnualIncome) : 'Estimate unavailable'} highlight={expectedAnnualIncome > 0} />
      </div>
    </div>
  )
}

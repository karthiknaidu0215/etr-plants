'use client'

import { usePlannerStore } from '@/stores/plannerStore'
import { formatNumber, SQFT_PER_ACRE } from '@/lib/utils'
import { Ruler, Info } from 'lucide-react'

export default function Step1Land() {
  const { landAcres, setLandAcres } = usePlannerStore()

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLandAcres(parseFloat(e.target.value))
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    if (!isNaN(v) && v >= 0.5 && v <= 100) setLandAcres(v)
  }

  const sqFt = Math.round(landAcres * SQFT_PER_ACRE)

  const presets = [1, 2, 3, 5, 10, 15, 25]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Ruler className="w-7 h-7 text-forest-700" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          How much land do you have?
        </h2>
        <p className="text-gray-500">Select your plantation area in acres</p>
      </div>

      {/* Big display */}
      <div className="bg-forest-900 rounded-3xl p-8 text-center mb-8 shadow-premium">
        <div className="flex items-center justify-center gap-3 mb-3">
          <input
            type="number"
            min="0.5"
            max="100"
            step="0.5"
            value={landAcres}
            onChange={handleInput}
            className="w-24 text-4xl font-black text-white bg-transparent border-b-2 border-white/30 focus:border-accent-400 outline-none text-center"
          />
          <span className="text-2xl font-bold text-white/60">Acres</span>
        </div>
        <p className="text-accent-400 text-lg font-medium">
          ≈ {formatNumber(sqFt)} sq ft
        </p>
        <p className="text-white/30 text-xs mt-1">1 acre = 43,560 sq ft</p>
      </div>

      {/* Slider */}
      <div className="mb-8">
        <input
          type="range"
          min="0.5"
          max="25"
          step="0.5"
          value={Math.min(landAcres, 25)}
          onChange={handleSlider}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.5 acres</span>
          <span>25 acres</span>
        </div>
      </div>

      {/* Quick preset buttons */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Select
        </p>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setLandAcres(p)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                landAcres === p
                  ? 'bg-forest-700 border-forest-700 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-forest-700 hover:text-forest-700'
              }`}
            >
              {p} {p === 1 ? 'Acre' : 'Acres'}
            </button>
          ))}
          <button
            onClick={() => setLandAcres(30)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 border-dashed transition-all ${
              landAcres > 25
                ? 'bg-forest-700 border-forest-700 text-white'
                : 'border-gray-300 text-gray-500 hover:border-forest-700 hover:text-forest-700'
            }`}
          >
            Custom (25+)
          </button>
        </div>
      </div>

      {/* Info note */}
      <div className="mt-6 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-blue-700 text-xs leading-relaxed">
          Your plantation area will be approximately <strong>75%</strong> of total land — the rest accounts for farmhouse, roads, and open spaces. You can adjust this in the Farm Design step.
        </p>
      </div>
    </div>
  )
}

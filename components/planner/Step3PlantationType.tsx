'use client'

import { useEffect, useState } from 'react'
import { usePlannerStore } from '@/stores/plannerStore'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/types'
import { Grid3X3, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORY_ICONS: Record<string, string> = {
  Fruit: '🍎',
  Wood: '🌳',
  Avenue: '🌺',
  Flowers: '🌸',
  Landscaping: '🌿',
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Fruit: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700' },
  Wood: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
  Avenue: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700' },
  Flowers: { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-700' },
  Landscaping: { bg: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-700' },
}

export default function Step3PlantationType() {
  const { selectedTypeIds, toggleType } = usePlannerStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data, error: err }) => {
        setLoading(false)
        if (err) setError(true)
        else setCategories(data || [])
      })
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Grid3X3 className="w-7 h-7 text-forest-700" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          What would you like to plant?
        </h2>
        <p className="text-gray-500">Select one or more plantation types</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading categories…</span>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-8">Unable to load categories. Please try again.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const selected = selectedTypeIds.includes(cat.id)
            const colors = CATEGORY_COLORS[cat.name] || {
              bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700',
            }
            return (
              <button
                key={cat.id}
                onClick={() => toggleType(cat.id)}
                className={cn(
                  'relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all group',
                  selected
                    ? `${colors.bg} ${colors.border} shadow-md scale-[1.02]`
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-card'
                )}
              >
                {/* Check badge */}
                {selected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-forest-700 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                {/* Icon */}
                <span className="text-5xl">{CATEGORY_ICONS[cat.name] || '🌱'}</span>

                {/* Name */}
                <span className={cn('font-bold text-base', selected ? colors.text : 'text-gray-800')}>
                  {cat.name}
                </span>

                {/* Description */}
                {cat.description && (
                  <span className="text-xs text-gray-500 text-center leading-relaxed">
                    {cat.description}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {selectedTypeIds.length > 0 && (
        <div className="mt-6 bg-forest-50 border border-forest-200 rounded-xl px-4 py-3 text-sm text-forest-700 font-medium text-center">
          ✓ {selectedTypeIds.length} type{selectedTypeIds.length > 1 ? 's' : ''} selected — Next step will show matching plants
        </div>
      )}
    </div>
  )
}

import Link from 'next/link'
import { Leaf, ArrowRight } from 'lucide-react'
import { Plant } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface PlantCardProps {
  plant: Plant
  showAddButton?: boolean
}

export function PlantCard({ plant, showAddButton = true }: PlantCardProps) {
  const categoryColors: Record<string, string> = {
    Fruit: 'bg-orange-100 text-orange-700',
    Wood: 'bg-amber-100 text-amber-700',
    Avenue: 'bg-purple-100 text-purple-700',
    Flowers: 'bg-pink-100 text-pink-700',
    Landscaping: 'bg-teal-100 text-teal-700',
  }
  const catName = (plant.category as { name?: string })?.name || ''
  const colorClass = categoryColors[catName] || 'bg-gray-100 text-gray-700'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all group overflow-hidden">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {plant.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={plant.image_url}
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #1a4731 0%, #52b788 100%)',
            }}
          >
            <Leaf className="w-14 h-14 text-white/60" />
          </div>
        )}
        {/* Category badge */}
        {catName && (
          <span className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-semibold ${colorClass}`}>
            {catName}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-1">{plant.name}</h3>
        {plant.description && (
          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
            {plant.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Spacing: <strong className="text-gray-700">{plant.default_spacing} ft</strong></span>
          <span className="font-bold text-forest-700 text-sm">
            {formatCurrency(plant.price_per_plant)}/plant
          </span>
        </div>

        {showAddButton && (
          <Link
            href={`/planner`}
            className="flex items-center justify-center gap-2 w-full bg-forest-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-800 transition-colors"
          >
            Add to Plan
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

// Skeleton loader
export function PlantCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
        <div className="flex justify-between">
          <div className="h-3 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="h-9 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}

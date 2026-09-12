import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PlantCard, PlantCardSkeleton } from '@/components/plants/PlantCard'

export default async function FeaturedPlants() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let plants: any[] = []
  let error = false

  try {
    const supabase = await createClient()
    const { data, error: err } = await supabase
      .from('plants')
      .select('*, category:categories(name)')
      .eq('is_active', true)
      .limit(4)

    if (err) error = true
    else plants = data || []
  } catch {
    error = true
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-2">
              Plant Catalog
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-700">
              Our Plant Collection
            </h2>
          </div>
          <Link
            href="/plants"
            className="inline-flex items-center gap-2 text-forest-700 font-semibold hover:text-forest-800 transition-colors"
          >
            View All Plants
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {error ? (
          <div className="text-center py-12 text-gray-500">
            <p>Unable to load plant data. Please try again.</p>
          </div>
        ) : plants.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <PlantCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

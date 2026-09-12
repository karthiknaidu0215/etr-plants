'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plant, Category } from '@/lib/types'
import { PlantCard, PlantCardSkeleton } from '@/components/plants/PlantCard'
import { Search, Leaf } from 'lucide-react'

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'spacing'>('name')

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('plants').select('*, category:categories(id, name)').eq('is_active', true),
      supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
    ]).then(([plantsRes, catsRes]) => {
      setPlants(plantsRes.data || [])
      setCategories(catsRes.data || [])
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    let list = [...plants]
    if (selectedCat !== 'all') list = list.filter((p) => p.category_id === selectedCat)
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
  }, [plants, selectedCat, search, sortBy])

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      {/* Hero banner */}
      <div className="bg-forest-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-7 h-7 text-accent-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Plants Library</h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Browse our curated collection of fruit, wood, avenue, flower and landscaping plants for your farm.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 bg-white rounded-xl text-sm focus:border-forest-700 focus:outline-none"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'spacing')}
            className="border-2 border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:border-forest-700 focus:outline-none"
          >
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="spacing">Sort: Spacing</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
              selectedCat === 'all'
                ? 'bg-forest-700 border-forest-700 text-white'
                : 'border-gray-200 text-gray-600 hover:border-forest-700 hover:text-forest-700 bg-white'
            }`}
          >
            All Plants
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                selectedCat === cat.id
                  ? 'bg-forest-700 border-forest-700 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-forest-700 hover:text-forest-700 bg-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Plant grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <PlantCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Leaf className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No plants found</p>
            <p className="text-sm mt-1">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} plant{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

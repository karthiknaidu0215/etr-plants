/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { Leaf, Grid3X3, MessageSquare, MapPin } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Run some simple count queries
  const [plantsRes, catsRes, leadsRes, locsRes] = await Promise.all([
    supabase.from('plants').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('locations').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Total Plants', value: plantsRes.count || 0, icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Categories', value: catsRes.count || 0, icon: Grid3X3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Locations', value: locsRes.count || 0, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Leads & Quotes', value: leadsRes.count || 0, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 ${s.bg} rounded-lg flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Welcome to ETR Admin</h2>
        <p className="text-gray-600 text-sm mb-4">
          Use the sidebar to navigate and manage your platform&apos;s data. 
          Changes made here will instantly reflect on the public website and planner.
        </p>
      </div>
    </div>
  )
}



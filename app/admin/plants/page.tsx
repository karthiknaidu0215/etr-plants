'use client'

import DataTable from '@/components/admin/DataTable'
import { formatCurrency } from '@/lib/utils'

export default function AdminPlantsPage() {
  const columns = [
    { key: 'name', label: 'Plant Name' },
    { key: 'scientific_name', label: 'Scientific Name' },
    { key: 'price_per_plant', label: 'Price', render: (val: number) => formatCurrency(val) },
    { key: 'default_spacing', label: 'Spacing (ft)', render: (val: number) => `${val} ft` },
    { key: 'is_active', label: 'Status', render: (val: boolean) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {val ? 'Active' : 'Inactive'}
      </span>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Plants</h1>
        <p className="text-gray-500 text-sm">Add, edit, or remove plants from your catalog.</p>
      </div>
      <DataTable title="Plants Catalog" tableName="plants" columns={columns} />
    </div>
  )
}

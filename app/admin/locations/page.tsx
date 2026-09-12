'use client'

import DataTable from '@/components/admin/DataTable'

export default function AdminLocationsPage() {
  const columns = [
    { key: 'state', label: 'State' },
    { key: 'district', label: 'District' },
    { key: 'mandal', label: 'Mandal/Village' },
    { key: 'is_active', label: 'Status', render: (val: boolean) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {val ? 'Active' : 'Inactive'}
      </span>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Locations</h1>
        <p className="text-gray-500 text-sm">Configure serviceable regions for the planner.</p>
      </div>
      <DataTable title="Serviceable Locations" tableName="locations" columns={columns} />
    </div>
  )
}

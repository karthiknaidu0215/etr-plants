'use client'

import DataTable from '@/components/admin/DataTable'

export default function AdminProjectsPage() {
  const columns = [
    { key: 'title', label: 'Project Title' },
    { key: 'location', label: 'Location' },
    { key: 'land_size_acres', label: 'Size (Acres)', render: (val: number) => val ? `${val} acres` : '-' },
    { key: 'plantation_type', label: 'Type' },
    { key: 'is_featured', label: 'Featured', render: (val: boolean) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
        {val ? 'Yes' : 'No'}
      </span>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Projects</h1>
        <p className="text-gray-500 text-sm">Showcase your completed plantation projects on the portfolio page.</p>
      </div>
      <DataTable title="Portfolio Projects" tableName="projects" columns={columns} />
    </div>
  )
}

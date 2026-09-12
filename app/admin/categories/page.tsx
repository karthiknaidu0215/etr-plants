/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import DataTable from '@/components/admin/DataTable'

export default function AdminCategoriesPage() {
  const columns = [
    { key: 'name', label: 'Category Name' },
    { key: 'description', label: 'Description' },
    { key: 'sort_order', label: 'Sort Order' },
    { key: 'is_active', label: 'Status', render: (val: boolean) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {val ? 'Active' : 'Inactive'}
      </span>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
        <p className="text-gray-500 text-sm">Organize your plants into plantation types.</p>
      </div>
      <DataTable title="Categories" tableName="categories" columns={columns} />
    </div>
  )
}



'use client'

import DataTable from '@/components/admin/DataTable'
import { formatCurrency } from '@/lib/utils'
import { FieldDef } from '@/components/admin/GenericFormModal'

export default function AdminFertilizersPage() {
  const columns = [
    { key: 'name', label: 'Fertilizer Name' },
    { key: 'price_per_unit', label: 'Price per Unit', render: (val: number) => formatCurrency(val) },
    { key: 'unit', label: 'Unit' },
    { key: 'is_active', label: 'Status', render: (val: boolean) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {val ? 'Active' : 'Inactive'}
      </span>
    )},
  ]

  const fields: FieldDef[] = [
    { key: 'name', label: 'Fertilizer Name', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'unit', label: 'Unit (e.g. kg, ton)', type: 'text', required: true },
    { key: 'price_per_unit', label: 'Price per Unit', type: 'number', required: true },
    { key: 'is_active', label: 'Is Active', type: 'boolean' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Fertilizers</h1>
        <p className="text-gray-500 text-sm">Add or edit fertilizers and pricing.</p>
      </div>
      <DataTable title="Fertilizers" tableName="fertilizers" columns={columns} fields={fields} />
    </div>
  )
}

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import DataTable from '@/components/admin/DataTable'
import { formatCurrency } from '@/lib/utils'
import { FieldDef } from '@/components/admin/GenericFormModal'

export default function AdminAdditionalItemsPage() {
  const columns = [
    { key: 'name', label: 'Item Name' },
    { key: 'category', label: 'Category', render: (val: string) => <span className="uppercase text-xs font-bold">{val}</span> },
    { key: 'price', label: 'Price', render: (val: number) => formatCurrency(val) },
    { key: 'unit', label: 'Unit' },
    { key: 'is_active', label: 'Status', render: (val: boolean) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {val ? 'Active' : 'Inactive'}
      </span>
    )},
  ]

  const fields: FieldDef[] = [
    { key: 'name', label: 'Item Name', type: 'text', required: true },
    { key: 'category', label: 'Category (labour, honey_bee_box, other)', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'unit', label: 'Unit (e.g. per acre, per box)', type: 'text', required: true },
    { key: 'price', label: 'Price', type: 'number', required: true },
    { key: 'is_optional', label: 'Is Optional', type: 'boolean' },
    { key: 'is_active', label: 'Is Active', type: 'boolean' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Additional Items</h1>
        <p className="text-gray-500 text-sm">Add or edit Labour costs, Honey Bee Boxes, Fencing, etc.</p>
      </div>
      <DataTable title="Additional Items" tableName="additional_items" columns={columns} fields={fields} />
    </div>
  )
}



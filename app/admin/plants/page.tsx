/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import DataTable from '@/components/admin/DataTable'
import { formatCurrency } from '@/lib/utils'
import { FieldDef } from '@/components/admin/GenericFormModal'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminPlantsPage() {
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    createClient().from('categories').select('id, name').then(({data}) => setCategories(data || []))
  }, [])

  const columns = [
    { key: 'name', label: 'Plant Name' },
    { key: 'category_id', label: 'Category', render: (val: string) => categories.find(c => c.id === val)?.name || val },
    { key: 'price_m', label: 'Medium Price', render: (val: number) => formatCurrency(val) },
    { key: 'default_spacing', label: 'Spacing (ft)', render: (val: number) => `${val} ft` },
    { key: 'is_active', label: 'Status', render: (val: boolean) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {val ? 'Active' : 'Inactive'}
      </span>
    )},
  ]

  const fields: FieldDef[] = [
    { key: 'name', label: 'Plant Name', type: 'text', required: true },
    { key: 'category_id', label: 'Category ID (UUID)', type: 'text', required: true }, // Simple implementation
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'default_spacing', label: 'Default Spacing (ft)', type: 'number', required: true },
    { key: 'min_spacing', label: 'Min Spacing (ft)', type: 'number', required: true },
    { key: 'max_spacing', label: 'Max Spacing (ft)', type: 'number', required: true },
    
    // Sizes
    { key: 'is_s_active', label: 'Size S Available', type: 'boolean' },
    { key: 'price_s', label: 'Size S Price', type: 'number' },
    { key: 'is_m_active', label: 'Size M Available', type: 'boolean' },
    { key: 'price_m', label: 'Size M Price', type: 'number' },
    { key: 'is_l_active', label: 'Size L Available', type: 'boolean' },
    { key: 'price_l', label: 'Size L Price', type: 'number' },
    
    { key: 'is_active', label: 'Is Active', type: 'boolean' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Plants</h1>
        <p className="text-gray-500 text-sm">Add, edit, or remove plants from your catalog. Note: Use category ID from categories table.</p>
      </div>
      <DataTable title="Plants Catalog" tableName="plants" columns={columns} fields={fields} />
    </div>
  )
}



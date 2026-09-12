/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import DataTable from '@/components/admin/DataTable'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function AdminPlansPage() {
  const columns = [
    { key: 'plan_id', label: 'Plan ID', render: (val: string) => <span className="font-mono text-xs font-bold text-forest-700">{val}</span> },
    { key: 'created_at', label: 'Date', render: (val: string) => formatDate(val) },
    { key: 'customer_name', label: 'Customer', render: (val: string) => val || 'Guest' },
    { key: 'land_acres', label: 'Land (Acres)' },
    { key: 'total_investment', label: 'Est. Investment', render: (val: number) => val ? formatCurrency(val) : '-' },
    { key: 'status', label: 'Status', render: (val: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
        val === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
      }`}>
        {val}
      </span>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Plantation Plans</h1>
        <p className="text-gray-500 text-sm">View generated plantation plans.</p>
      </div>
      <DataTable title="Generated Plans" tableName="plantation_plans" columns={columns} />
    </div>
  )
}



'use client'

import DataTable from '@/components/admin/DataTable'
import { formatDate } from '@/lib/utils'

export default function AdminLeadsPage() {
  const columns = [
    { key: 'lead_id', label: 'Lead ID', render: (val: string) => <span className="font-mono text-xs font-bold text-forest-700">{val}</span> },
    { key: 'created_at', label: 'Date', render: (val: string) => formatDate(val) },
    { key: 'customer_name', label: 'Customer' },
    { key: 'customer_phone', label: 'Phone' },
    { key: 'intent', label: 'Intent', render: (val: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${val === 'order' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
        {val}
      </span>
    )},
    { key: 'status', label: 'Status', render: (val: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
        val === 'new' ? 'bg-amber-100 text-amber-700' : 
        val === 'contacted' ? 'bg-blue-100 text-blue-700' :
        val === 'closed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {val}
      </span>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads & Quotes</h1>
        <p className="text-gray-500 text-sm">Review quote requests and orders submitted by users.</p>
      </div>
      <DataTable title="Customer Leads" tableName="leads" columns={columns} />
    </div>
  )
}

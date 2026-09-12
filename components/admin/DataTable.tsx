'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react'

interface DataTableProps {
  title: string
  tableName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[]
}

export default function DataTable({ title, tableName, columns }: DataTableProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: res } = await supabase.from(tableName).select('*').order('created_at', { ascending: false })
    setData(res || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    const supabase = createClient()
    await supabase.from(tableName).delete().eq('id', id)
    fetchData()
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <button className="flex items-center gap-1 text-sm bg-forest-700 text-white px-3 py-1.5 rounded-lg hover:bg-forest-800 transition-colors">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-3">{col.label}</th>
              ))}
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-gray-400">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3 text-gray-700">
                      {col.render ? col.render(row[col.key], row) : row[col.key]?.toString() || '-'}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

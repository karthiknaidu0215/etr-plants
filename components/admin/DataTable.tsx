/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
﻿'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react'
import GenericFormModal, { FieldDef } from './GenericFormModal'

interface DataTableProps {
  title: string
  tableName: string
  columns: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[]
  fields?: FieldDef[]
}

export default function DataTable({ title, tableName, columns, fields }: DataTableProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: res } = await supabase.from(tableName).select('*').order('created_at', { ascending: false })
    setData(res || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [tableName])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    const supabase = createClient()
    await supabase.from(tableName).delete().eq('id', id)
    fetchData()
  }

  const handleSave = async (formData: any) => {
    const supabase = createClient()
    if (editingItem) {
      const { error } = await supabase.from(tableName).update(formData).eq('id', editingItem.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from(tableName).insert(formData)
      if (error) throw error
    }
    fetchData()
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {fields && (
          <button onClick={() => { setEditingItem(null); setModalOpen(true) }} className="flex items-center gap-1 text-sm bg-forest-700 text-white px-3 py-1.5 rounded-lg hover:bg-forest-800 transition-colors">
            <Plus className="w-4 h-4" /> Add New
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-3 font-medium">{col.label}</th>
              ))}
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={columns.length + 1} className="px-5 py-10 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" /></td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="px-5 py-10 text-center text-gray-400">No records found.</td></tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3 text-gray-700">
                      {col.render ? col.render(row[col.key], row) : row[col.key]?.toString() || '-'}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-right space-x-2">
                    {fields && (
                      <button onClick={() => { setEditingItem(row); setModalOpen(true) }} className="text-blue-600 hover:text-blue-800 p-1"><Edit className="w-4 h-4" /></button>
                    )}
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

      {fields && (
        <GenericFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={editingItem}
          fields={fields}
          title={editingItem ? 'Edit Item' : 'Add New Item'}
        />
      )}
    </div>
  )
}

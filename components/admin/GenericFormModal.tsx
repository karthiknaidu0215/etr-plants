/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
﻿import { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'

export interface FieldDef {
  key: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'textarea'
  required?: boolean
}

interface GenericModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialData?: any
  fields: FieldDef[]
  title: string
}

export default function GenericFormModal({ isOpen, onClose, onSave, initialData, fields, title }: GenericModalProps) {
  const [formData, setFormData] = useState<any>(initialData || {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave(formData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="p-5 overflow-y-auto flex-1">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
          <form id="generic-form" onSubmit={handleSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                {f.type === 'boolean' ? (
                  <input type="checkbox" checked={formData[f.key] || false} onChange={e => setFormData({...formData, [f.key]: e.target.checked})} className="w-4 h-4 text-forest-600 rounded border-gray-300" />
                ) : f.type === 'textarea' ? (
                  <textarea required={f.required} value={formData[f.key] || ''} onChange={e => setFormData({...formData, [f.key]: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border" rows={3} />
                ) : (
                  <input required={f.required} type={f.type} value={formData[f.key] || ''} onChange={e => setFormData({...formData, [f.key]: f.type === 'number' ? parseFloat(e.target.value) : e.target.value})} className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border" />
                )}
              </div>
            ))}
          </form>
        </div>
        
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg">Cancel</button>
          <button type="submit" form="generic-form" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-forest-700 hover:bg-forest-800 rounded-lg flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

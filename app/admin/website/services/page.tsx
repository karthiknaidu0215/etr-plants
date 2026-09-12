/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Edit, Loader2, Upload, X, Save } from 'lucide-react'

export default function ServicesPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  })
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: res } = await supabase.from('services').select('*').order('created_at', { ascending: true })
    setData(res || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    const supabase = createClient()
    await supabase.from('services').delete().eq('id', id)
    fetchData()
  }

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item)
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        is_active: item.is_active ?? true
      })
    } else {
      setFormData({ name: '', description: '', is_active: true })
    }
    setFile(null)
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    let iconUrl = editingItem?.icon_url

    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `service-icon-${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('website_assets')
        .upload(fileName, file)
      
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('website_assets').getPublicUrl(fileName)
        iconUrl = urlData.publicUrl
      }
    }

    const payload = {
      icon_url: iconUrl,
      name: formData.name,
      description: formData.description,
      is_active: formData.is_active
    }

    if (editingItem) {
      await supabase.from('services').update(payload).eq('id', editingItem.id)
    } else {
      await supabase.from('services').insert([payload])
    }

    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Services</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-1 text-sm bg-forest-700 text-white px-3 py-1.5 rounded-lg hover:bg-forest-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-5 py-3 font-medium w-16">Icon</th>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Description</th>
              <th className="px-5 py-3 font-medium">Active</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" /></td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No services found.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    {item.icon_url ? (
                      <img src={item.icon_url} alt={item.name} className="w-10 h-10 object-contain bg-gray-50 rounded p-1" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">-</div>
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{item.description}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.is_active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800 p-1"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg">{editingItem ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-5">
              <form id="service-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Icon</label>
                  <div className="flex items-center gap-4">
                    {(file || editingItem?.icon_url) && (
                      <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded p-1 flex items-center justify-center">
                        <img src={file ? URL.createObjectURL(file) : editingItem.icon_url} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                      <Upload className="w-4 h-4" /> {file || editingItem ? 'Change Icon' : 'Select Icon'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-forest-600 rounded border-gray-300"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active (Visible)</label>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg">Cancel</button>
              <button type="submit" form="service-form" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-forest-700 hover:bg-forest-800 rounded-lg flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Edit, Loader2, Upload, X, Save } from 'lucide-react'

export default function AdminProjectsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    land_size_acres: 0,
    plantation_type: '',
    description: '',
    status: '',
    is_featured: false
  })
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: res } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setData(res || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    const supabase = createClient()
    await supabase.from('projects').delete().eq('id', id)
    fetchData()
  }

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item)
    if (item) {
      setFormData({
        title: item.title || '',
        location: item.location || '',
        land_size_acres: item.land_size_acres || 0,
        plantation_type: item.plantation_type || '',
        description: item.description || '',
        status: item.status || '',
        is_featured: item.is_featured ?? false
      })
    } else {
      setFormData({
        title: '', location: '', land_size_acres: 0, plantation_type: '',
        description: '', status: 'Completed', is_featured: false
      })
    }
    setFile(null)
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    let imageUrl = editingItem?.image_url

    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `project-${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('website_assets')
        .upload(fileName, file)
      
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('website_assets').getPublicUrl(fileName)
        imageUrl = urlData.publicUrl
      }
    }

    const payload = {
      image_url: imageUrl,
      title: formData.title,
      location: formData.location,
      land_size_acres: formData.land_size_acres,
      plantation_type: formData.plantation_type,
      description: formData.description,
      status: formData.status,
      is_featured: formData.is_featured
    }

    if (editingItem) {
      await supabase.from('projects').update(payload).eq('id', editingItem.id)
    } else {
      await supabase.from('projects').insert([payload])
    }

    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Projects</h1>
        <p className="text-gray-500 text-sm">Showcase your completed plantation projects on the portfolio page.</p>
      </div>
      
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Portfolio Projects</h2>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-1 text-sm bg-forest-700 text-white px-3 py-1.5 rounded-lg hover:bg-forest-800 transition-colors">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 font-medium w-16">Image</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Size</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Featured</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" /></td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No projects found.</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-10 h-10 object-cover bg-gray-50 rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">-</div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-900">{item.title}</td>
                    <td className="px-5 py-3 text-gray-700">{item.location}</td>
                    <td className="px-5 py-3 text-gray-700">{item.land_size_acres ? `${item.land_size_acres} acres` : '-'}</td>
                    <td className="px-5 py-3 text-gray-700">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{item.status || 'N/A'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.is_featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.is_featured ? 'Yes' : 'No'}
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-lg">{editingItem ? 'Edit Project' : 'Add Project'}</h2>
                <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="p-5 overflow-y-auto flex-1">
                <form id="project-form" onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                      <div className="flex items-center gap-4">
                        {(file || editingItem?.image_url) && (
                          <div className="w-24 h-16 bg-gray-50 border border-gray-200 rounded overflow-hidden">
                            <img src={file ? URL.createObjectURL(file) : editingItem.image_url} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                          <Upload className="w-4 h-4" /> {file || editingItem ? 'Change Image' : 'Select Image'}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Size (Acres)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.land_size_acres}
                        onChange={(e) => setFormData({ ...formData, land_size_acres: parseFloat(e.target.value) })}
                        className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plantation Type</label>
                      <input
                        type="text"
                        value={formData.plantation_type}
                        onChange={(e) => setFormData({ ...formData, plantation_type: e.target.value })}
                        className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
                      >
                        <option value="">Select Status</option>
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Upcoming">Upcoming</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 text-forest-600 rounded border-gray-300"
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Featured (Show on homepage/top of portfolio)</label>
                  </div>
                </form>
              </div>
              
              <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg">Cancel</button>
                <button type="submit" form="project-form" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-forest-700 hover:bg-forest-800 rounded-lg flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



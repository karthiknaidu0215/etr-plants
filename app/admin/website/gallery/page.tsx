/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Edit, Loader2, Upload, X, Save } from 'lucide-react'

export default function GalleryPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    caption: '',
    sort_order: 0,
    is_active: true
  })
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: res } = await supabase.from('gallery_images').select('*').order('sort_order', { ascending: true })
    setData(res || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    const supabase = createClient()
    await supabase.from('gallery_images').delete().eq('id', id)
    fetchData()
  }

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item)
    if (item) {
      setFormData({
        caption: item.caption || '',
        sort_order: item.sort_order || 0,
        is_active: item.is_active ?? true
      })
    } else {
      setFormData({ caption: '', sort_order: 0, is_active: true })
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
      const fileName = `gallery-${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file)
      
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(fileName)
        imageUrl = urlData.publicUrl
      }
    }

    if (!imageUrl && !editingItem) {
      alert("Please upload an image.")
      setSaving(false)
      return
    }

    const payload = {
      image_url: imageUrl,
      caption: formData.caption,
      sort_order: formData.sort_order,
      is_active: formData.is_active
    }

    if (editingItem) {
      await supabase.from('gallery_images').update(payload).eq('id', editingItem.id)
    } else {
      await supabase.from('gallery_images').insert([payload])
    }

    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Gallery Images</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-1 text-sm bg-forest-700 text-white px-3 py-1.5 rounded-lg hover:bg-forest-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        ) : data.length === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-400">No images found.</div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden group relative">
              <div className="aspect-square bg-gray-100 relative">
                <img src={item.image_url} alt={item.caption} className="w-full h-full object-cover" />
                {!item.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-bold px-2 py-1 bg-black/50 rounded">Hidden</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleOpenModal(item)} className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-2 text-xs truncate text-gray-600">
                {item.caption || 'No caption'}
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg">{editingItem ? 'Edit Image' : 'Add Image'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-5">
              <form id="gallery-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image File</label>
                  <div className="flex items-center gap-4">
                    {(file || editingItem?.image_url) && (
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                  <input
                    type="text"
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                    className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
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
              <button type="submit" form="gallery-form" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-forest-700 hover:bg-forest-800 rounded-lg flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



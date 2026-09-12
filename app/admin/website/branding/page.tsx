/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, Upload } from 'lucide-react'

export default function BrandingPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    logo_url: '',
    website_name: '',
    tagline: ''
  })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: contentData } = await supabase.from('website_content').select('*').eq('section', 'branding')
    
    if (contentData) {
      const newObj = { ...data }
      contentData.forEach((item) => {
        if (item.key === 'logo_url') newObj.logo_url = item.value
        if (item.key === 'website_name') newObj.website_name = item.value
        if (item.key === 'tagline') newObj.tagline = item.value
      })
      setData(newObj)
    }
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    let uploadedLogoUrl = data.logo_url
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `logo-${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('website_assets')
        .upload(fileName, file)
      
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('website_assets').getPublicUrl(fileName)
        uploadedLogoUrl = urlData.publicUrl
      }
    }

    const itemsToSave = [
      { key: 'logo_url', value: uploadedLogoUrl, section: 'branding' },
      { key: 'website_name', value: data.website_name, section: 'branding' },
      { key: 'tagline', value: data.tagline, section: 'branding' },
    ]

    for (const item of itemsToSave) {
      const { data: existing } = await supabase.from('website_content').select('id').eq('key', item.key).single()
      if (existing) {
        await supabase.from('website_content').update({ value: item.value }).eq('id', existing.id)
      } else {
        await supabase.from('website_content').insert([item])
      }
    }

    setData(prev => ({ ...prev, logo_url: uploadedLogoUrl }))
    setFile(null)
    setSaving(false)
    alert('Branding updated successfully!')
  }

  if (loading) {
    return <div className="flex items-center justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 max-w-2xl">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Branding Settings</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website Logo</label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
              {file ? (
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-contain" />
              ) : data.logo_url ? (
                <img src={data.logo_url} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-gray-400 text-xs text-center p-2">No logo</span>
              )}
            </div>
            <div>
              <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload New Logo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
              <p className="text-xs text-gray-500 mt-2">Recommended: PNG or SVG with transparent background.</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website Name</label>
          <input
            type="text"
            value={data.website_name}
            onChange={(e) => setData({ ...data, website_name: e.target.value })}
            className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
            placeholder="e.g. ETR Plants"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
          <input
            type="text"
            value={data.tagline}
            onChange={(e) => setData({ ...data, tagline: e.target.value })}
            className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
            placeholder="e.g. Your Partner in Green Spaces"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-forest-700 hover:bg-forest-800 rounded-lg flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}



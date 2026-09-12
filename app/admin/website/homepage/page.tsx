/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2 } from 'lucide-react'

export default function HomepageSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    hero_title: '',
    hero_subtitle: '',
    about_text: '',
    footer_text: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: contentData } = await supabase.from('website_content').select('*').eq('section', 'homepage')
    
    if (contentData) {
      const newObj = { ...data }
      contentData.forEach((item) => {
        if (item.key in newObj) {
          (newObj as any)[item.key] = item.value
        }
      })
      setData(newObj)
    }
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    const itemsToSave = Object.entries(data).map(([key, value]) => ({
      key, value, section: 'homepage'
    }))

    for (const item of itemsToSave) {
      const { data: existing } = await supabase.from('website_content').select('id').eq('key', item.key).single()
      if (existing) {
        await supabase.from('website_content').update({ value: item.value }).eq('id', existing.id)
      } else {
        await supabase.from('website_content').insert([item])
      }
    }

    setSaving(false)
    alert('Homepage content updated successfully!')
  }

  if (loading) {
    return <div className="flex items-center justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 max-w-2xl">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Homepage Content</h2>
      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900 border-b border-gray-100 pb-2">Hero Section</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
            <input
              type="text"
              value={data.hero_title}
              onChange={(e) => setData({ ...data, hero_title: e.target.value })}
              className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <textarea
              value={data.hero_subtitle}
              onChange={(e) => setData({ ...data, hero_subtitle: e.target.value })}
              className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-md font-medium text-gray-900 border-b border-gray-100 pb-2">About Section</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Us Text</label>
            <textarea
              value={data.about_text}
              onChange={(e) => setData({ ...data, about_text: e.target.value })}
              className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
              rows={5}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-md font-medium text-gray-900 border-b border-gray-100 pb-2">Footer</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Footer Copyright Text</label>
            <input
              type="text"
              value={data.footer_text}
              onChange={(e) => setData({ ...data, footer_text: e.target.value })}
              className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
            />
          </div>
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



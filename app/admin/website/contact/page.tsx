/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    facebook_url: '',
    instagram_url: '',
    linkedin_url: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: contentData } = await supabase.from('website_content').select('*').eq('section', 'contact')
    
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
      key, value, section: 'contact'
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
    alert('Contact details updated successfully!')
  }

  if (loading) {
    return <div className="flex items-center justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 max-w-2xl">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Contact & Social Details</h2>
      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={data.whatsapp}
              onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
              className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
          <textarea
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
            rows={3}
          />
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h3 className="text-md font-medium text-gray-900">Social Media Links</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input
              type="url"
              value={data.facebook_url}
              onChange={(e) => setData({ ...data, facebook_url: e.target.value })}
              className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input
              type="url"
              value={data.instagram_url}
              onChange={(e) => setData({ ...data, instagram_url: e.target.value })}
              className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-forest-500 focus:border-forest-500 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={data.linkedin_url}
              onChange={(e) => setData({ ...data, linkedin_url: e.target.value })}
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



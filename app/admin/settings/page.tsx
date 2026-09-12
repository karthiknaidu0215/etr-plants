'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, Info } from 'lucide-react'

export default function AdminSettingsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const fetchSettings = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('estimation_settings').select('*').order('key')
    setSettings(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleChange = (id: string, newAmount: number) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: { ...s.value, amount: newAmount } } : s))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    const supabase = createClient()
    
    for (const s of settings) {
      await supabase
        .from('estimation_settings')
        .update({ value: s.value })
        .eq('id', s.id)
    }
    
    setSaving(false)
    setMsg('Settings saved successfully!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Estimation Settings</h1>
        <p className="text-gray-500 text-sm">Configure default cost parameters used in the planner calculations.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Cost Parameters (per acre)</h2>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 text-sm bg-forest-700 text-white px-4 py-2 rounded-lg hover:bg-forest-800 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>

        <div className="p-6 space-y-6">
          {msg && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium">
              {msg}
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
            </div>
          ) : (
            settings.map((s) => (
              <div key={s.id} className="grid sm:grid-cols-2 gap-4 items-start pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div>
                  <label className="block font-semibold text-gray-900 text-sm mb-1">
                    {s.key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </label>
                  <p className="text-xs text-gray-500">{s.description}</p>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={s.value.amount || 0}
                    onChange={(e) => handleChange(s.id, parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-blue-50 p-4 border-t border-blue-100 flex gap-2">
          <Info className="w-5 h-5 text-blue-500 shrink-0" />
          <p className="text-xs text-blue-800 leading-relaxed">
            Changes to these settings will instantly reflect in the Plantation Planner for all new calculations. Existing saved plans are not affected.
          </p>
        </div>
      </div>
    </div>
  )
}

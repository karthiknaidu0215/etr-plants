'use client'

import { useEffect, useState } from 'react'
import { usePlannerStore } from '@/stores/plannerStore'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Loader2, ChevronDown } from 'lucide-react'

interface LocOption { value: string; label: string }

export default function Step2Location() {
  const { selectedState, selectedDistrict, selectedMandal, setLocation } = usePlannerStore()

  const [states, setStates] = useState<LocOption[]>([])
  const [districts, setDistricts] = useState<LocOption[]>([])
  const [mandals, setMandals] = useState<LocOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Load states on mount
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('locations')
      .select('state')
      .eq('is_active', true)
      .then(({ data, error: err }) => {
        setLoading(false)
        if (err) { setError(true); return }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unique = Array.from(new Set((data || []).map((r: any) => r.state))).sort()
        setStates(unique.map((s) => ({ value: s, label: s })))
      })
  }, [])

  // Load districts when state changes
  useEffect(() => {
    if (!selectedState) { setDistricts([]); setMandals([]); return }
    const supabase = createClient()
    supabase
      .from('locations')
      .select('district')
      .eq('state', selectedState)
      .eq('is_active', true)
      .then(({ data }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unique = Array.from(new Set((data || []).map((r: any) => r.district))).sort()
        setDistricts(unique.map((d) => ({ value: d, label: d })))
      })
  }, [selectedState])

  // Load mandals when district changes
  useEffect(() => {
    if (!selectedState || !selectedDistrict) { setMandals([]); return }
    const supabase = createClient()
    supabase
      .from('locations')
      .select('mandal')
      .eq('state', selectedState)
      .eq('district', selectedDistrict)
      .eq('is_active', true)
      .neq('mandal', null)
      .then(({ data }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unique = Array.from(new Set((data || []).map((r: any) => r.mandal).filter(Boolean))).sort()
        setMandals(unique.map((m) => ({ value: m, label: m })))
      })
  }, [selectedState, selectedDistrict])

  const SelectField = ({
    label, value, options, placeholder, disabled, onChange,
  }: {
    label: string; value: string; options: LocOption[]; placeholder: string
    disabled?: boolean; onChange: (v: string) => void
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:border-forest-700 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed pr-10"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-7 h-7 text-forest-700" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Where is your land located?
        </h2>
        <p className="text-gray-500">Select state, district and village for regional recommendations</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading location data…</span>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>Unable to load location data. Please check your connection.</p>
        </div>
      ) : (
        <div className="space-y-5">
          <SelectField
            label="State"
            value={selectedState}
            options={states}
            placeholder="Select State"
            onChange={(v) => setLocation(v, '', '')}
          />
          <SelectField
            label="District"
            value={selectedDistrict}
            options={districts}
            placeholder={selectedState ? 'Select District' : 'Select State first'}
            disabled={!selectedState}
            onChange={(v) => setLocation(selectedState, v, '')}
          />
          <SelectField
            label="Mandal / Village (Optional)"
            value={selectedMandal}
            options={mandals}
            placeholder={selectedDistrict ? 'Select Mandal' : 'Select District first'}
            disabled={!selectedDistrict}
            onChange={(v) => setLocation(selectedState, selectedDistrict, v)}
          />

          {selectedState && (
            <div className="bg-forest-50 border border-forest-200 rounded-xl p-4 mt-4">
              <p className="text-forest-700 text-sm font-medium">
                📍 Selected Location
              </p>
              <p className="text-forest-800 font-bold mt-1">
                {[selectedMandal, selectedDistrict, selectedState].filter(Boolean).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

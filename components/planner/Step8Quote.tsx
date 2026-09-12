'use client'

import { useState } from 'react'
import { usePlannerStore } from '@/stores/plannerStore'
import { createClient } from '@/lib/supabase/client'
import { generateLeadId } from '@/lib/utils'
import { Send, CheckCircle2, Loader2, PhoneCall } from 'lucide-react'

export default function Step8Quote() {
  const {
    planId, landAcres, selectedState, selectedDistrict, selectedMandal,
    selectedPlants, setQuoteSubmitted, quoteSubmitted, leadId,
  } = usePlannerStore()

  const [form, setForm] = useState({
    name: '', phone: '', email: '', message: '', intent: 'quote' as 'quote' | 'order',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone number are required.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const newLeadId = generateLeadId()

      const leadData = {
        lead_id: newLeadId,
        plan_id: null as string | null,
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_email: form.email.trim() || null,
        location_state: selectedState || null,
        location_district: selectedDistrict || null,
        location_mandal: selectedMandal || null,
        land_size_acres: landAcres,
        selected_plants: selectedPlants.map((sp) => ({
          plant_id: sp.plantId,
          plant_name: sp.plant.name,
          plant_size: sp.size,
          spacing: sp.spacing,
          quantity: sp.plantCount,
          allocation_percentage: sp.allocationPercentage,
          allocated_acres: sp.allocatedAcres,
        })),
        message: form.message.trim() || null,
        status: 'new',
        intent: form.intent,
      }

      const { error: dbErr } = await supabase.from('leads').insert(leadData)
      if (dbErr) throw dbErr

      setQuoteSubmitted(newLeadId)
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Unable to submit. Please try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (quoteSubmitted && leadId) {
    return (
      <div className="max-w-xl mx-auto text-center py-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Request Submitted!</h2>
        <p className="text-gray-500 mb-6">
          Your {form.intent === 'order' ? 'order' : 'quote request'} has been received. Our team will contact you shortly.
        </p>
        <div className="bg-forest-50 border border-forest-200 rounded-2xl p-5 text-left mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Reference ID:</span>
            <span className="font-bold text-forest-700">{leadId}</span>
          </div>
          {planId && (
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Plan ID:</span>
              <span className="font-bold text-forest-700">{planId}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Land Size:</span>
            <span className="font-bold">{landAcres} acres</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-forest-700">
          <PhoneCall className="w-4 h-4" />
          <span className="text-sm">Expect a call from our team within 1-2 business days</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Send className="w-7 h-7 text-forest-700" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Request a Quote</h2>
        <p className="text-gray-500">Our team will prepare a detailed proposal for your plantation project.</p>
        {planId && (
          <div className="inline-block bg-forest-50 border border-forest-200 rounded-xl px-4 py-2 mt-3">
            <span className="text-xs text-forest-600">Plan Reference: </span>
            <span className="font-bold text-forest-800">{planId}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Optional)</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none"
          />
        </div>

        {/* Auto-filled location */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-700 mb-1">Plan Details (auto-filled)</p>
          <p>📍 {[selectedMandal, selectedDistrict, selectedState].filter(Boolean).join(', ') || 'Location not selected'}</p>
          <p>🌱 {landAcres} Acres • {selectedPlants.map((sp) => sp.plant.name).join(', ') || 'No plants selected'}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
          <textarea
            rows={3}
            placeholder="Any specific requirements or questions..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none resize-none"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium">{error}</p>
        )}

        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            onClick={() => setForm((f) => ({ ...f, intent: 'quote' }))}
            className="flex items-center justify-center gap-2 bg-forest-700 text-white py-3 rounded-xl font-bold hover:bg-forest-800 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Request Quote
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={() => setForm((f) => ({ ...f, intent: 'order' }))}
            className="flex items-center justify-center gap-2 border-2 border-forest-700 text-forest-700 py-3 rounded-xl font-bold hover:bg-forest-50 transition-colors disabled:opacity-60"
          >
            Order Plants
          </button>
        </div>
      </form>
    </div>
  )
}

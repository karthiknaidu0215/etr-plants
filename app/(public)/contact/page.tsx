'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateLeadId } from '@/lib/utils'
import { Send, CheckCircle2, Loader2, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const content = useWebsiteContent()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are required.')
      return
    }
    setLoading(true); setError('')
    try {
      const supabase = createClient()
      await supabase.from('leads').insert({
        lead_id: generateLeadId(),
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_email: form.email.trim() || null,
        message: form.message.trim() || null,
        status: 'new',
        intent: 'quote',
        selected_plants: [],
      })
      setSubmitted(true)
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <div className="bg-forest-900 text-white py-14 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-white/60">We&apos;d love to help you plan your plantation</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-forest-700 mb-6">Get in Touch</h2>
            <div className="space-y-5">
              {[
                { icon: Phone, label: 'Phone', value: content.phone, href: content.phone ? `tel:${content.phone}` : undefined },
                { icon: MessageCircle, label: 'WhatsApp', value: content.whatsapp, href: content.whatsapp ? `https://wa.me/${content.whatsapp.replace(/[^0-9]/g, '')}` : undefined },
                { icon: Mail, label: 'Email', value: content.email, href: content.email ? `mailto:${content.email}` : undefined },
                { icon: MapPin, label: 'Location', value: content.address, href: undefined },
              ].filter(item => item.value).map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-forest-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-forest-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{label}</p>
                    {href
                      ? <a href={href} target={href.startsWith('https') ? '_blank' : undefined} rel="noopener noreferrer" className="text-forest-700 hover:underline text-sm">{value}</a>
                      : <p className="text-gray-500 text-sm">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500">Our team will get back to you within 1-2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900">Send a Message</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Name *</label>
                    <input
                      required type="text" placeholder="Your name"
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Phone *</label>
                    <input
                      required type="tel" placeholder="+91 9876543210"
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Email (Optional)</label>
                  <input
                    type="email" placeholder="your@email.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Message</label>
                  <textarea
                    rows={4} placeholder="Tell us about your plantation project..."
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none resize-none"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-forest-700 text-white py-3.5 rounded-xl font-bold hover:bg-forest-800 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

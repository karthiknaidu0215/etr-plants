'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { requestOtp, verifyOtpAndReset } from './actions'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Username, 2: OTP & Password
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData()
    formData.append('username', username)
    const res = await requestOtp(formData)
    
    if (res.success) {
      setStep(2)
      setMsg('If an eligible account exists, an OTP has been sent to the registered recovery phone number. (Note: Missing SMS_PROVIDER_SECRET will mock the send in server logs).')
    } else {
      setError(res.error || 'Failed to request OTP')
    }
    setLoading(false)
  }

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.append('username', username)

    const res = await verifyOtpAndReset(formData)
    if (res.success) {
      router.push('/admin/login?reset=success')
    } else {
      setError(res.error || 'Failed to reset password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card border border-gray-100 p-8 text-center relative">
        <Link href="/admin/login" className="absolute top-6 left-6 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-16 h-16 bg-forest-900 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2">
          <Leaf className="w-8 h-8 text-accent-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Recovery</h1>
        
        {step === 1 ? (
          <>
            <p className="text-gray-500 mb-8 text-sm">Enter your username (Super Admin) to receive an OTP on your registered phone.</p>
            <form onSubmit={handleRequest} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Username (e.g. admin1)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none"
              />
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-forest-700 text-white py-3.5 rounded-xl font-bold hover:bg-forest-800 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-forest-600 mb-6 text-sm bg-forest-50 p-3 rounded-lg border border-forest-100">{msg}</p>
            <form onSubmit={handleReset} className="space-y-4">
              <input
                name="otp"
                type="text"
                required
                placeholder="6-Digit OTP"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none tracking-widest text-center font-mono text-lg"
              />
              <input
                name="newPassword"
                type="password"
                required
                placeholder="New Password (min 6 chars)"
                minLength={6}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none"
              />
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-forest-700 text-white py-3.5 rounded-xl font-bold hover:bg-forest-800 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

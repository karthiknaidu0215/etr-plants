'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Leaf, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const mappedEmail = `${username.trim().toLowerCase()}@etrplants.internal`

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: mappedEmail,
      password,
    })

    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'Invalid username or password' : err.message)
      setLoading(false)
    } else {
      // Check if user is active in admin_profiles
      const { data: profile } = await supabase.from('admin_profiles').select('is_active').eq('id', data.user.id).single()
      
      if (profile && profile.is_active === false) {
        await supabase.auth.signOut()
        setError('Your account has been deactivated.')
        setLoading(false)
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card border border-gray-100 p-8 text-center relative">
        <div className="w-16 h-16 bg-forest-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-8 h-8 text-accent-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p className="text-gray-500 mb-8">Sign in to manage ETR Plants</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-forest-700 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-forest-700 text-white py-3.5 rounded-xl font-bold hover:bg-forest-800 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link href="/admin/forgot-password" className="text-forest-600 hover:underline font-medium">Forgot Password?</Link>
        </div>

        <div className="mt-8 text-xs text-gray-400">
          <p>This area is restricted to authorized personnel only.</p>
        </div>
      </div>
    </div>
  )
}

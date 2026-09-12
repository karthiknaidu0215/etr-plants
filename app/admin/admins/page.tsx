/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Shield, Lock, CheckCircle2, AlertCircle } from 'lucide-react'

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  
  const [passwords, setPasswords] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState('')

  const fetchAdmins = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profile } = await supabase.from('admin_profiles').select('role').eq('id', user.id).single()
      if (profile && profile.role === 'super_admin') {
        setIsSuperAdmin(true)
        const { data: allAdmins } = await supabase.from('admin_profiles').select('*').order('username')
        setAdmins(allAdmins || [])
      }
    }
    setLoading(false)
  }

  useEffect(() => { fetchAdmins() }, [])

  const toggleActive = async (id: string, current: boolean) => {
    if (!isSuperAdmin) return
    const supabase = createClient()
    await supabase.from('admin_profiles').update({ is_active: !current }).eq('id', id)
    fetchAdmins()
  }

  const changePassword = async (username: string) => {
    if (!isSuperAdmin) return
    const newPass = passwords[username]
    if (!newPass || newPass.length < 6) return alert('Password must be at least 6 characters')
    
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', newPass)
    
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        body: formData
      })
      const result = await res.json()
      if (result.success) {
        setMsg(`Password for ${username} updated successfully`)
        setPasswords(prev => ({...prev, [username]: ''}))
        setTimeout(() => setMsg(''), 3000)
      } else {
        alert(result.error || 'Failed to update')
      }
    } catch (e) {
      alert('Network error')
    }
  }

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-forest-700" /></div>
  
  if (!isSuperAdmin) return (
    <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center">
      <Shield className="w-12 h-12 mb-3 text-red-400" />
      <h2 className="text-xl font-bold">Access Denied</h2>
      <p className="mt-2 text-sm">Only the Super Admin (Admin 1) can manage administrator accounts.</p>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-forest-700" />
          Administrator Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">Super Admin controls for Admin 2 and Admin 3.</p>
      </div>
      
      {msg && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 border border-green-200"><CheckCircle2 className="w-5 h-5"/> {msg}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {admins.map(admin => (
          <div key={admin.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card relative">
            {admin.role === 'super_admin' && <span className="absolute top-4 right-4 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">SUPER ADMIN</span>}
            <h3 className="text-lg font-black text-gray-900">{admin.username}</h3>
            
            <div className="mt-4 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${admin.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm font-medium text-gray-700">{admin.is_active ? 'Active' : 'Inactive'}</span>
            </div>

            {admin.role !== 'super_admin' && (
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                <button
                  onClick={() => toggleActive(admin.id, admin.is_active)}
                  className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${admin.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                >
                  {admin.is_active ? 'Deactivate Account' : 'Activate Account'}
                </button>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Lock className="w-3.5 h-3.5"/> Change Password</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="New password"
                      value={passwords[admin.username] || ''}
                      onChange={e => setPasswords(p => ({...p, [admin.username]: e.target.value}))}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-forest-600"
                    />
                    <button
                      onClick={() => changePassword(admin.username)}
                      disabled={!passwords[admin.username]}
                      className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}



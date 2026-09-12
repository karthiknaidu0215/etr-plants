'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

// A mock SMS sender. In a real scenario, integrate Twilio/MessageBird here.
async function sendSms(phone: string, otp: string) {
  const providerKey = process.env.SMS_PROVIDER_SECRET
  if (!providerKey) {
    console.warn(`[MOCK SMS] Would send OTP ${otp} to ${phone}. SMS_PROVIDER_SECRET is missing.`)
    // We log it so we can test it locally if no provider is setup, but the user is aware.
    // The requirement says "Clearly identify the ONE required provider config... Keep in secure server-side env vars only."
  } else {
    // Real integration logic would go here
    console.log(`[SMS] Sending OTP to ${phone}`)
  }
}

export async function requestOtp(formData: FormData) {
  const username = formData.get('username') as string
  if (!username) return { success: false, error: 'Username is required' }
  
  if (username !== 'admin1') {
    // Return success anyway to prevent user enumeration
    return { success: true }
  }

  const supabase = createAdminClient()
  
  const { data: profile } = await supabase.from('admin_profiles').select('id, recovery_phone').eq('username', 'admin1').single()
  
  if (!profile || !profile.recovery_phone) {
    return { success: true } // Pretend success
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 mins

  // Clear old OTPs
  await supabase.from('otp_recovery').delete().eq('admin_id', profile.id)

  const { error } = await supabase.from('otp_recovery').insert({
    admin_id: profile.id,
    otp_hash: otpHash,
    expires_at: expiresAt,
    attempts: 0
  })

  if (error) {
    console.error('OTP Insert error', error)
    return { success: false, error: 'Failed to process request' }
  }

  await sendSms(profile.recovery_phone, otp)

  return { success: true }
}

export async function verifyOtpAndReset(formData: FormData) {
  const username = formData.get('username') as string
  const otp = formData.get('otp') as string
  const newPassword = formData.get('newPassword') as string

  if (username !== 'admin1') return { success: false, error: 'Invalid request' }
  if (!otp || !newPassword || newPassword.length < 6) return { success: false, error: 'Invalid input' }

  const supabase = createAdminClient()
  const { data: profile } = await supabase.from('admin_profiles').select('id').eq('username', 'admin1').single()
  if (!profile) return { success: false, error: 'Invalid request' }

  const { data: recoveryRows } = await supabase.from('otp_recovery').select('*').eq('admin_id', profile.id)
  
  if (!recoveryRows || recoveryRows.length === 0) {
    return { success: false, error: 'OTP expired or invalid' }
  }

  const recovery = recoveryRows[0]

  if (new Date(recovery.expires_at) < new Date()) {
    await supabase.from('otp_recovery').delete().eq('admin_id', profile.id)
    return { success: false, error: 'OTP has expired' }
  }

  if (recovery.attempts >= 3) {
    await supabase.from('otp_recovery').delete().eq('admin_id', profile.id)
    return { success: false, error: 'Too many attempts. Request a new OTP.' }
  }

  const hash = crypto.createHash('sha256').update(otp).digest('hex')
  if (recovery.otp_hash !== hash) {
    await supabase.from('otp_recovery').update({ attempts: recovery.attempts + 1 }).eq('id', recovery.id)
    return { success: false, error: 'Incorrect OTP' }
  }

  // Update password
  const { error: updateError } = await supabase.auth.admin.updateUserById(profile.id, { password: newPassword })
  if (updateError) {
    return { success: false, error: 'Failed to update password' }
  }

  // Cleanup
  await supabase.from('otp_recovery').delete().eq('admin_id', profile.id)

  return { success: true }
}

import { runSecureSetup } from './actions'
import fs from 'fs'
import path from 'path'
import { redirect } from 'next/navigation'

export default function SecureSetupPage() {
  const isLocked = fs.existsSync(path.join(process.cwd(), 'setup.lock'))
  if (isLocked) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-red-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Secure System Setup
          </h2>
          <p className="mt-2 text-center text-sm text-red-600 font-medium">
            ONE-TIME AUTHORIZATION REQUIRED
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Please provide the Database password to execute the necessary autonomous schema upgrades, and securely configure your three Admin accounts.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" action={async (formData) => {
          'use server'
          const res = await runSecureSetup(formData)
          if (res.success) {
            redirect('/admin/login?setup=success')
          } else {
            throw new Error(res.error)
          }
        }}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Supabase Database Password</label>
              <input name="dbPassword" type="password" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-forest-500 focus:border-forest-500 sm:text-sm" />
            </div>
            
            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700">Admin 1 Password (admin1)</label>
              <input name="admin1Password" type="password" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-forest-500 focus:border-forest-500 sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Admin 1 Recovery Phone</label>
              <input name="admin1Phone" type="tel" required placeholder="+91..." className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-forest-500 focus:border-forest-500 sm:text-sm" />
            </div>

            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700">Admin 2 Password (admin2)</label>
              <input name="admin2Password" type="password" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-forest-500 focus:border-forest-500 sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Admin 3 Password (admin3)</label>
              <input name="admin3Password" type="password" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-forest-500 focus:border-forest-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-forest-600 hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500">
              Execute Autonomous Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

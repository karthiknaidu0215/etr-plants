/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const websiteTabs = [
  { href: '/admin/website/branding', label: 'Branding' },
  { href: '/admin/website/contact', label: 'Contact' },
  { href: '/admin/website/homepage', label: 'Homepage' },
  { href: '/admin/website/gallery', label: 'Gallery' },
  { href: '/admin/website/services', label: 'Services' },
]

export default function WebsiteCMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Website CMS</h1>
        <p className="text-gray-500 text-sm">Manage your public website content and assets.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {websiteTabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  isActive
                    ? 'border-forest-500 text-forest-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="pt-4">
        {children}
      </div>
    </div>
  )
}



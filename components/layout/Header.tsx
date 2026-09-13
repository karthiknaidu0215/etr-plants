'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, Menu, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/plants', label: 'Plants Library' },
  { href: '/planner', label: 'Plantation Planner' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const content = useWebsiteContent()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isAdmin = pathname?.startsWith('/admin')
  if (isAdmin) return null

  const siteName = content.website_name || 'ETR Plants'
  const logoUrl = content.logo_url || ''

  const LogoMark = ({ size = 9, iconSize = 5 }: { size?: number; iconSize?: number }) => (
    logoUrl
      ? <img src={logoUrl} alt={siteName} className={`w-${size} h-${size} rounded-lg object-contain`} />
      : <div className={`w-${size} h-${size} bg-forest-700 rounded-lg flex items-center justify-center group-hover:bg-forest-800 transition-colors`}>
          <Leaf className={`w-${iconSize} h-${iconSize} text-white`} />
        </div>
  )

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <LogoMark size={9} iconSize={5} />
              <span
                className={cn(
                  'text-xl font-bold tracking-tight transition-colors',
                  scrolled ? 'text-forest-700' : 'text-white'
                )}
              >
                {siteName.includes(' ')
                  ? <>{siteName.split(' ')[0]} <span className={scrolled ? 'text-accent-500' : 'text-accent-400'}>{siteName.split(' ').slice(1).join(' ')}</span></>
                  : siteName
                }
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? scrolled
                        ? 'text-forest-700 bg-forest-50'
                        : 'text-white bg-white/20'
                      : scrolled
                        ? 'text-gray-600 hover:text-forest-700 hover:bg-forest-50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/planner"
                className="hidden sm:inline-flex items-center gap-2 bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-forest-800 transition-all shadow-md hover:shadow-lg"
              >
                Design My Farm
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/login"
                className="hidden lg:inline-flex items-center gap-2 border-2 border-forest-600 text-forest-700 bg-white/90 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-forest-50 transition-all"
              >
                Admin Login
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className={cn(
                  'lg:hidden p-2 rounded-lg transition-colors',
                  scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                )}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {logoUrl
                  ? <img src={logoUrl} alt={siteName} className="w-8 h-8 rounded-lg object-contain" />
                  : <div className="w-8 h-8 bg-forest-700 rounded-lg flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-white" />
                    </div>
                }
                <span className="font-bold text-forest-700">{siteName}</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-forest-50 text-forest-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-forest-700'
                  )}
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-100 space-y-3">
              <Link
                href="/planner"
                className="flex items-center justify-center gap-2 bg-forest-700 text-white px-4 py-3 rounded-xl font-semibold hover:bg-forest-800 transition-colors w-full"
              >
                Design My Farm
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center justify-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, Phone, Mail, MapPin } from 'lucide-react'

const footerLinks = {
  quickLinks: [
    { href: '/', label: 'Home' },
    { href: '/plants', label: 'Plants Library' },
    { href: '/planner', label: 'Plantation Planner' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ],
  services: [
    'Plantation Planning',
    'Plant Selection',
    'Farm Layout Design',
    'Investment Estimation',
    'Maintenance Planning',
    'Expected Income Analysis',
  ],
}

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  return (
    <footer className="bg-forest-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-forest-700 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                ETR <span className="text-accent-400">Plants</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your trusted partner for plantation planning, farm design, and expert agricultural guidance across Andhra Pradesh, Telangana, and Tamil Nadu.
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: 'f', title: 'Facebook' },
                { label: 'in', title: 'Instagram' },
                { label: 'yt', title: 'YouTube' },
              ].map(({ label, title }) => (
                <a
                  key={title}
                  href="#"
                  aria-label={title}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-forest-700 flex items-center justify-center transition-colors text-xs font-bold text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-accent-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-accent-400 mb-4">
              Our Services
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((service) => (
                <li key={service} className="text-gray-400 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-accent-400 mb-4">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-accent-500 shrink-0" />
                <span>Contact address will be configured by admin.</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-accent-500 shrink-0" />
                <span>Phone number managed via admin panel</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-accent-500 shrink-0" />
                <span>Email configured by admin</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/planner"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                <Leaf className="w-4 h-4" />
                Design My Farm
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} ETR Plants. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs text-center sm:text-right max-w-md">
            Income and yield figures shown on this platform are estimates based on configured assumptions and may vary depending on climate, soil, maintenance, and market conditions.
          </p>
        </div>
      </div>
    </footer>
  )
}

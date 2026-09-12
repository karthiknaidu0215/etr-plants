import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'ETR Plants | Plantation Planning & Farm Design',
    template: '%s | ETR Plants',
  },
  description:
    'Create a customized plantation plan for your land. Choose plants, design your farm layout, estimate investment and expected income with ETR Plants.',
  keywords: ['plantation planning', 'farm design', 'plant nursery', 'ETR Plants', 'Andhra Pradesh', 'Telangana'],
  openGraph: {
    title: 'ETR Plants | Plantation Planning & Farm Design',
    description: 'Design your farm, plan your plantation, grow smarter with ETR Plants.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

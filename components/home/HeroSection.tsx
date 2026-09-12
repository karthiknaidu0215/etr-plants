'use client'

import Link from 'next/link'
import { ChevronRight, Leaf, TrendingUp, Shield } from 'lucide-react'

const stats = [
  { icon: Leaf, label: '10+ Plant Varieties' },
  { icon: TrendingUp, label: '3 States Coverage' },
  { icon: Shield, label: 'Expert Guidance' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #071510 0%, #0d2818 30%, #1a4731 65%, #2d6a4f 100%)',
        }}
      />
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #52b788 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Leaf className="w-4 h-4 text-accent-400" />
          Plantation Planning Platform for Indian Farmers
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6">
          Design Your Farm.{' '}
          <span className="text-accent-400">Plan Your Plantation.</span>{' '}
          Grow Smarter.
        </h1>

        {/* Supporting text */}
        <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Create a customized plantation plan for your land with the right plants,
          spacing, investment estimate and expected returns.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/planner"
            className="flex items-center gap-2 bg-white text-forest-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-cream-100 transition-all shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5"
          >
            Start Planning
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            href="/plants"
            className="flex items-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:border-white hover:bg-white/10 transition-all"
          >
            Explore Plants
          </Link>
        </div>

        {/* Stats badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {stats.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl text-white/90 text-sm font-medium"
            >
              <Icon className="w-4 h-4 text-accent-400" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-white/20 animate-pulse" />
      </div>
    </section>
  )
}

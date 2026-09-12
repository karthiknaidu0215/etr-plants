import Link from 'next/link'
import { CheckCircle2, ChevronRight, Leaf } from 'lucide-react'

const points = [
  'Expert plantation consultants with 10+ years field experience',
  'Region-specific plant recommendations for AP, Telangana & TN',
  'Data-driven spacing and density calculations',
  'Transparent, itemized investment breakdowns',
  'Post-planting maintenance and fertilizer schedules',
  'Ongoing support from planning to harvest',
]

export default function AboutSection() {
  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Visual */}
          <div className="relative">
            <div
              className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-premium"
              style={{
                background: 'linear-gradient(135deg, #0d2818 0%, #1a4731 50%, #52b788 100%)',
              }}
            >
              {/* Decorative leaf pattern */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="grid grid-cols-5 gap-8 p-12">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <Leaf
                      key={i}
                      className="w-8 h-8 text-white"
                      style={{ transform: `rotate(${i * 37}deg)` }}
                    />
                  ))}
                </div>
              </div>
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-2xl font-bold">ETR Plants</p>
                  <p className="text-white/70 text-sm mt-2">Grow with Confidence</p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-card p-5 border border-gray-100">
              <p className="text-2xl font-black text-forest-700">3+</p>
              <p className="text-xs text-gray-500 font-medium">States Covered</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-3">
              About ETR Plants
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-700 mb-5 leading-tight">
              Your Partner in Smart Farm Planning
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              ETR Plants is a professional plantation planning and plant supply company serving farmers and landowners across Andhra Pradesh, Telangana, and Tamil Nadu. We combine agricultural expertise with technology to help you make the best decisions for your land.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our interactive plantation planner takes the guesswork out of farming — from choosing the right plants for your region to calculating your exact investment and expected income.
            </p>

            <ul className="space-y-3 mb-8">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm">{point}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-forest-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-forest-800 transition-colors shadow-md hover:shadow-lg"
            >
              Learn More About Us
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

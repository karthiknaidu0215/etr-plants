import Link from 'next/link'
import { Leaf, Target, Users, HeartHandshake, ChevronRight } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'About ETR Plants' }

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <div className="bg-forest-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Leaf className="w-8 h-8 text-accent-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">About ETR Plants</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Your trusted partner for plantation planning, plant supply and farm design — helping farmers grow smarter.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div
              className="aspect-[4/3] rounded-3xl shadow-premium"
              style={{ background: 'linear-gradient(135deg, #0d2818, #1a4731, #52b788)' }}
            />
            <div>
              <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Mission</p>
              <h2 className="text-3xl font-bold text-forest-700 mb-5">
                Making Smart Farm Planning Accessible to Every Farmer
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                ETR Plants was founded with a single goal: to help Indian farmers and landowners make the best possible decisions about their plantations. We combine agricultural science with modern technology to give you a complete farm planning experience.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our interactive Plantation Planner guides you from land selection to a downloadable professional farm plan — complete with plant counts, investment estimates, fertilizer schedules and income projections.
              </p>
              <p className="text-gray-400 text-sm italic">
                * Company details, history, and team information will be configured by the admin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-forest-700">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Precision', desc: 'Every recommendation is backed by agricultural data and scientific spacing calculations.' },
              { icon: Users, title: 'Partnership', desc: 'We work alongside farmers — from planning through to harvest and beyond.' },
              { icon: HeartHandshake, title: 'Transparency', desc: 'Clear, itemized cost breakdowns with no hidden charges or exaggerated income promises.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-8 border border-gray-100 rounded-2xl shadow-card">
                <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-forest-700" />
                </div>
                <h3 className="font-bold text-xl mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-forest-700">
        <div className="text-center max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to plan your plantation?</h2>
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 bg-white text-forest-700 px-7 py-3 rounded-xl font-bold hover:bg-cream-100 transition-all"
          >
            Start Planning <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

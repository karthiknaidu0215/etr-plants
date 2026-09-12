import { FlaskConical, Users, HeartHandshake, BadgeCheck } from 'lucide-react'

const reasons = [
  {
    icon: FlaskConical,
    title: 'Scientific Approach',
    desc: 'Every recommendation is backed by agricultural data — spacing formulas, soil compatibility, and regional suitability.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    desc: 'Our experienced plantation consultants guide you from planning to planting to harvest.',
    color: 'text-forest-700',
    bg: 'bg-forest-50',
  },
  {
    icon: HeartHandshake,
    title: 'End-to-End Support',
    desc: 'We supply plants, support installation, and provide ongoing maintenance guidance for your farm.',
    color: 'text-accent-600',
    bg: 'bg-accent-400/10',
  },
  {
    icon: BadgeCheck,
    title: 'Transparent Pricing',
    desc: 'Itemized cost breakdowns with no hidden charges — know exactly what you\'re investing.',
    color: 'text-earth-500',
    bg: 'bg-earth-300/10',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Why ETR Plants
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-forest-700 mb-4">
            The ETR Plants Difference
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.title} className="text-center p-7 rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all">
                <div className={`w-14 h-14 ${r.bg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <Icon className={`w-7 h-7 ${r.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{r.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

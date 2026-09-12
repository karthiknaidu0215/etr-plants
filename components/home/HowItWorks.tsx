import { MapPin, Grid3X3, Leaf, LayoutDashboard, FileText, Ruler } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Ruler,
    title: 'Select Your Land',
    desc: 'Enter land area in acres using a simple slider or type exact value.',
  },
  {
    number: '02',
    icon: MapPin,
    title: 'Choose Location',
    desc: 'Select your state, district, and village for regional recommendations.',
  },
  {
    number: '03',
    icon: Grid3X3,
    title: 'Select Plantation Type',
    desc: 'Choose from Fruit, Wood, Avenue, Flowers, or Landscaping categories.',
  },
  {
    number: '04',
    icon: Leaf,
    title: 'Choose Plants',
    desc: 'Pick plants, adjust spacing and land allocation percentages live.',
  },
  {
    number: '05',
    icon: LayoutDashboard,
    title: 'Design Your Farm',
    desc: 'Drag and drop zones — farmhouse, roads, water, plantation blocks.',
  },
  {
    number: '06',
    icon: FileText,
    title: 'Get Your Complete Plan',
    desc: 'Download a professional PDF with investment estimate and income projection.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-forest-700 mb-4">
            From Land to Plantation — In 6 Simple Steps
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Our smart planner guides you through every decision. No agriculture expertise required.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-2xl p-7 shadow-card border border-gray-100 hover:shadow-card-hover transition-shadow group"
              >
                {/* Step number */}
                <span className="absolute top-6 right-6 text-4xl font-black text-gray-100 group-hover:text-forest-50 transition-colors select-none">
                  {step.number}
                </span>
                {/* Icon */}
                <div className="w-12 h-12 bg-forest-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-forest-700 transition-colors">
                  <Icon className="w-6 h-6 text-forest-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>

                {/* Connector arrow (not on last items of each row) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-forest-700 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import {
  Leaf, MapPin, LayoutDashboard, Calculator, Calendar, TrendingUp
} from 'lucide-react'

const features = [
  {
    icon: Leaf,
    title: 'Plantation Planning',
    desc: 'Scientifically plan your plantation with proper plant spacing, density and category selection.',
    color: 'text-forest-700',
    bg: 'bg-forest-50',
  },
  {
    icon: MapPin,
    title: 'Plant Selection',
    desc: 'Choose from an expert-curated catalog of fruit, wood, avenue, flower and landscaping plants.',
    color: 'text-accent-600',
    bg: 'bg-accent-400/10',
  },
  {
    icon: LayoutDashboard,
    title: 'Farm Layout Design',
    desc: 'Visually design your farm with an interactive canvas — drag farmhouse, roads, and plantation blocks.',
    color: 'text-earth-500',
    bg: 'bg-earth-300/10',
  },
  {
    icon: Calculator,
    title: 'Investment Estimation',
    desc: 'Get an itemized cost breakdown — plants, fertilizer, setup, labour — all in Indian Rupees.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Calendar,
    title: 'Maintenance Planning',
    desc: 'Receive a detailed fertilizer schedule and care plan for every plant you select.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: TrendingUp,
    title: 'Expected Income',
    desc: 'Understand your plantation\'s earning potential with crop yield and income projections.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Platform Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-forest-700 mb-4">
            Everything You Need to Plan Your Plantation
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A complete toolkit from land selection to investment analysis — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="bg-white border border-gray-100 rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-all group"
              >
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

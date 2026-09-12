import Link from 'next/link'
import { ChevronRight, Leaf } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 bg-forest-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
          Ready to Design Your Farm?
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
          Start your free plantation plan today. No expertise required — our planner guides you through every step.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/planner"
            className="flex items-center gap-2 bg-white text-forest-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-cream-100 transition-all shadow-xl hover:-translate-y-0.5"
          >
            Start Planning Now
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:border-white hover:bg-white/10 transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}

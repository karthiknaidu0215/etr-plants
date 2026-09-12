import { Quote } from 'lucide-react'

// Placeholder testimonials — to be replaced via Admin panel
const testimonials = [
  {
    id: 1,
    name: 'Placeholder Customer',
    location: 'West Godavari, Andhra Pradesh',
    text: 'This testimonial will be added by the admin. ETR Plants helped us plan our 5-acre mango plantation with precise spacing and investment estimates.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Placeholder Customer',
    location: 'Karimnagar, Telangana',
    text: 'This testimonial will be added by the admin. The farm designer tool made it easy to visualize exactly how our teak plantation would look.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Placeholder Customer',
    location: 'Coimbatore, Tamil Nadu',
    text: 'This testimonial will be added by the admin. The plantation plan PDF was professional and made it easy to get bank financing for our project.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-accent-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-white/50 text-sm">
            * Testimonials below are placeholders — real testimonials can be added via the Admin panel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors"
            >
              <Quote className="w-8 h-8 text-accent-400 mb-4 opacity-60" />
              <p className="text-white/70 text-sm leading-relaxed mb-6 italic">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-forest-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/50 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

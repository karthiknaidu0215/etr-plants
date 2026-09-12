import { Metadata } from 'next'
import { Suspense } from 'react'
import HeroSection from '@/components/home/HeroSection'
import HowItWorks from '@/components/home/HowItWorks'
import Features from '@/components/home/Features'
import AboutSection from '@/components/home/AboutSection'
import FeaturedPlants from '@/components/home/FeaturedPlants'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTASection from '@/components/home/CTASection'
import { PlantCardSkeleton } from '@/components/plants/PlantCard'
import { ProjectCardSkeleton } from '@/components/projects/ProjectCard'

export const metadata: Metadata = {
  title: 'ETR Plants | Plantation Planning & Farm Design',
  description:
    'Create a customized plantation plan for your land. Choose plants, design your farm layout, estimate investment and expected income with ETR Plants.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <Features />
      <Suspense fallback={
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <PlantCardSkeleton key={i} />)}
            </div>
          </div>
        </section>
      }>
        <FeaturedPlants />
      </Suspense>
      <AboutSection />
      <Suspense fallback={
        <section className="py-20 bg-cream-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)}
            </div>
          </div>
        </section>
      }>
        <FeaturedProjects />
      </Suspense>
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}

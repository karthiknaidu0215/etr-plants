import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProjectCard, ProjectCardSkeleton } from '@/components/projects/ProjectCard'

export default async function FeaturedProjects() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let projects: any[] = []
  let error = false

  try {
    const supabase = await createClient()
    const { data, error: err } = await supabase
      .from('projects')
      .select('*')
      .eq('is_featured', true)
      .order('sort_order')
      .limit(3)

    if (err) error = true
    else projects = data || []
  } catch {
    error = true
  }

  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-2">
              Portfolio
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-700">
              Our Work
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-forest-700 font-semibold hover:text-forest-800 transition-colors"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {error ? (
          <div className="text-center py-12 text-gray-500">
            <p>Unable to load project data. Please try again.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

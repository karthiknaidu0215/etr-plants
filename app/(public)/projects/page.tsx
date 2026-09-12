'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Project } from '@/lib/types'
import { ProjectCard, ProjectCardSkeleton } from '@/components/projects/ProjectCard'
import { Image as ImageIcon } from 'lucide-react'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('projects')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setProjects(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <div className="bg-forest-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-7 h-7 text-accent-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Our Projects</h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Real plantation projects planned and executed by ETR Plants across Andhra Pradesh, Telangana and Tamil Nadu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No projects added yet</p>
            <p className="text-sm mt-1">Projects can be added through the Admin panel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

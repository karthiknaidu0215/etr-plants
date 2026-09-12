import { MapPin, Ruler, Image as ImageIcon } from 'lucide-react'
import { Project } from '@/lib/types'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const image = project.images?.[0]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all group overflow-hidden">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a4731, #2d6a4f)' }}
          >
            <ImageIcon className="w-12 h-12 text-white/40" />
          </div>
        )}
        {project.plantation_type && (
          <span className="absolute top-3 left-3 bg-forest-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {project.plantation_type}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-forest-700 transition-colors">
          {project.title}
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {project.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {project.location}
            </span>
          )}
          {project.land_size_acres && (
            <span className="flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5" />
              {project.land_size_acres} acres
            </span>
          )}
        </div>
        {project.description && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}
      </div>
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-full" />
      </div>
    </div>
  )
}

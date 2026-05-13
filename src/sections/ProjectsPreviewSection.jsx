import { motion } from 'framer-motion'
import { ArrowRight, Calendar, MapPin, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { SectionTitle } from '../components/common/SectionTitle'
import { staggerContainer, fadeUp, viewportConfig } from '../animations/variants'

const statusConfig = {
  completed: { label: 'Terminé', class: 'bg-green-50 text-green-700' },
  ongoing: { label: 'En cours', class: 'bg-amber-50 text-amber-700' },
}

function ProjectCard({ project }) {
  const status = statusConfig[project.status]

  return (
    <motion.article
      variants={fadeUp}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="h-52 bg-gradient-to-br from-green-700 to-green-950 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
          🌿
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.class}`}>
            {status.label}
          </span>
        </div>

        {/* Funder badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30">
            {project.funder}
          </span>
        </div>

        {/* Category */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{project.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            <span>{project.location}</span>
          </div>
        </div>

        <h3 className="font-poppins font-bold text-gray-900 text-lg leading-tight mb-3 group-hover:text-green-700 transition-colors">
          {project.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
          {project.description}
        </p>

        {/* Key result */}
        <div className="bg-green-50 rounded-xl p-3 mb-5 border border-green-100">
          <p className="text-green-700 text-xs font-medium">
            ✓ {project.results[0]}
          </p>
        </div>

        <Link
          to="/projets"
          className="inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold hover:gap-2.5 transition-all group/link"
        >
          Voir le projet
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  )
}

export function ProjectsPreviewSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Nos réalisations sur le terrain"
          title="Projets récents"
          subtitle="Des projets concrets, mesurables et impactants pour les communautés et l'environnement de la Guinée."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            to="/projets"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Voir tous les projets
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

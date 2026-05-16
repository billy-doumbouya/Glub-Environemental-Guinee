import { motion } from 'framer-motion'
import { Leaf, Users, Heart, BookOpen, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { domains } from '../data/domains'
import { SectionTitle } from '../components/common/SectionTitle'
import { staggerContainer, fadeUp, viewportConfig } from '../animations/variants'

const iconMap = { leaf: Leaf, users: Users, heart: Heart, book: BookOpen }

function DomainCard({ domain, index }) {
  const Icon = iconMap[domain.icon] || Leaf

  return (
    <motion.div
      variants={fadeUp}
      className="group relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
        style={{ background: `linear-gradient(135deg, ${domain.bgColor}, white)` }}
      />

      <div className="relative">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300"
          style={{ backgroundColor: domain.bgColor }}
        >
          <Icon className="w-7 h-7" style={{ color: domain.color }} />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 block">
          Domaine {String(index + 1).padStart(2, '0')}
        </span>

        <h3 className="font-poppins font-bold text-xl text-gray-900 mb-4 leading-tight">
          {domain.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {domain.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {domain.activities.slice(0, 2).map((activity) => (
            <span
              key={activity}
              className="text-xs px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100"
            >
              {activity}
            </span>
          ))}
        </div>

        <Link
          to={`/domaines`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
          style={{ color: domain.color }}
        >
          Voir plus
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}

export function DomainsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Nos 4 piliers d'action"
          title="Domaines d'intervention"
          subtitle="ONG C.E.G agit sur quatre axes stratégiques complémentaires pour un impact durable sur les communautés et l'environnement guinéen."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {domains.map((domain, i) => (
            <DomainCard key={domain.id} domain={domain} index={i} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportConfig}
          className="text-center mt-12"
        >
          <Link
            to="/domaines"
            className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200"
          >
            Explorer tous nos domaines
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

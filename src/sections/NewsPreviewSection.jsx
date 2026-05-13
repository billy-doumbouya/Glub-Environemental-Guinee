import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { news } from '../data/news'
import { SectionTitle } from '../components/common/SectionTitle'
import { staggerContainer, fadeUp, viewportConfig } from '../animations/variants'

const categoryColors = {
  Événement: 'bg-green-50 text-green-700',
  Formation: 'bg-blue-50 text-blue-700',
  Partenariat: 'bg-amber-50 text-amber-700',
  Publication: 'bg-purple-50 text-purple-700',
}

function NewsCard({ article, featured = false }) {
  return (
    <motion.article
      variants={fadeUp}
      className={`group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className={`bg-gradient-to-br from-green-700 to-green-950 relative ${featured ? 'h-64' : 'h-48'}`}>
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">🌿</div>
        <div className="absolute top-4 left-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[article.category] || 'bg-gray-50 text-gray-600'}`}>
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Calendar className="w-3 h-3" />
          {article.date}
          <span className="text-gray-300">•</span>
          {article.author}
        </div>
        <h3 className="font-poppins font-bold text-gray-900 text-lg leading-tight mb-3 group-hover:text-green-700 transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
        <Link
          to="/actualites"
          className="inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold"
        >
          Lire la suite <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  )
}

export function NewsPreviewSection() {
  const featured = news.filter((n) => n.featured).slice(0, 1)[0]
  const others = news.filter((n) => !n.featured).slice(0, 2)

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Restez informé"
          title="Actualités C.E.G"
          subtitle="Suivez les dernières nouvelles, événements et publications de l'ONG Club Environnemental de Guinée."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {featured && <NewsCard article={featured} featured />}
          {others.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200"
          >
            Toutes les actualités <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

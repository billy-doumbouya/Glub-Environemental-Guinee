import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, User, Tag, ArrowRight } from 'lucide-react'
import { SEO } from '../seo/SEO'
import { MainLayout } from '../layouts/MainLayout'
import { PageHero } from '../components/common/PageHero'
import { news } from '../data/news'
import { staggerContainer, fadeUp, viewportConfig } from '../animations/variants'

const categories = ['Toutes', 'Événement', 'Formation', 'Partenariat', 'Publication']

const categoryColors = {
  Événement: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
  Formation: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  Partenariat: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  Publication: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
}

function NewsCard({ article, featured = false }) {
  const cat = categoryColors[article.category] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' }

  return (
    <motion.article
      variants={fadeUp}
      className={`group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex ${featured ? 'flex-row' : 'flex-col'}`}
    >
      <div className={`bg-gradient-to-br from-green-700 to-green-950 relative overflow-hidden ${featured ? 'w-72 shrink-0' : 'h-48'}`}>
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">🌿</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
            {article.category}
          </span>
        </div>
        {article.featured && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">À la une</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />{article.date}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />{article.author}
          </span>
        </div>

        <h3 className="font-poppins font-bold text-gray-900 text-lg leading-tight mb-3 group-hover:text-green-700 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{article.excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full">
              <Tag className="w-2.5 h-2.5" />{tag}
            </span>
          ))}
        </div>

        <button className="inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold self-start">
          Lire la suite <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.article>
  )
}

export default function NewsPage() {
  const [activeFilter, setActiveFilter] = useState('Toutes')

  const filtered = activeFilter === 'Toutes'
    ? news
    : news.filter((n) => n.category === activeFilter)

  const featured = filtered.find((n) => n.featured)
  const others = filtered.filter((n) => !n.featured || filtered.indexOf(n) > 0)

  return (
    <>
      <SEO
        title="Actualités"
        description="Suivez les dernières actualités, événements, formations et publications de l'ONG Club Environnemental de Guinée (C.E.G)."
        keywords="actualités CEG Guinée, événements ONG environnement, nouvelles club environnemental Guinée"
      />
      <MainLayout>
        <PageHero
          badge="Restez informé"
          title="Actualités"
          subtitle="Découvrez les dernières nouvelles, événements et publications de l'ONG C.E.G."
          breadcrumb={['Accueil', 'Actualités']}
        />

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === cat
                      ? 'bg-green-600 text-white shadow-md shadow-green-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Featured article */}
            {featured && (
              <div className="mb-10">
                <NewsCard article={featured} featured />
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {others.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">Aucune actualité dans cette catégorie.</p>
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    </>
  )
}

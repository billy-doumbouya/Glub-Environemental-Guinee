import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, Images } from 'lucide-react'
import { SEO } from '../seo/SEO'
import { MainLayout } from '../layouts/MainLayout'
import { PageHero } from '../components/common/PageHero'
import { staggerContainer, fadeUp, viewportConfig } from '../animations/variants'

const galleryItems = [
  { id: 1, title: 'Campagne de reboisement — Forécariah', category: 'Reboisement', emoji: '🌳', span: 'md:col-span-2 md:row-span-2' },
  { id: 2, title: 'Formation des femmes leaders', category: 'Genre', emoji: '👩', span: '' },
  { id: 3, title: 'Sensibilisation communautaire', category: 'Sensibilisation', emoji: '📢', span: '' },
  { id: 4, title: 'Activités maraîchères durables', category: 'Agriculture', emoji: '🌱', span: '' },
  { id: 5, title: 'Distribution de plants forestiers', category: 'Reboisement', emoji: '🌿', span: 'md:col-span-2' },
  { id: 6, title: 'Atelier de formation agroécologie', category: 'Formation', emoji: '🎓', span: '' },
  { id: 7, title: 'Construction de latrines villageoises', category: 'Santé', emoji: '🏗️', span: '' },
  { id: 8, title: 'Journée mondiale de l\'environnement', category: 'Événement', emoji: '🌍', span: 'md:col-span-2' },
  { id: 9, title: 'Réunion des comités locaux', category: 'Gouvernance', emoji: '🤝', span: '' },
  { id: 10, title: 'Inventaire des espèces forestières', category: 'Recherche', emoji: '🔬', span: '' },
  { id: 11, title: 'Champs écoles paysans', category: 'Agriculture', emoji: '🌾', span: '' },
  { id: 12, title: 'Cérémonie de remise de certificats', category: 'Formation', emoji: '🏆', span: '' },
]

const galleryCategories = ['Toutes', 'Reboisement', 'Genre', 'Agriculture', 'Formation', 'Sensibilisation', 'Événement']

const gradients = [
  'from-green-700 to-green-950',
  'from-blue-700 to-blue-950',
  'from-emerald-700 to-emerald-950',
  'from-teal-700 to-teal-950',
  'from-cyan-700 to-cyan-900',
]

function GalleryItem({ item, onOpen, index }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer ${item.span || ''}`}
      onClick={() => onOpen(item)}
    >
      <div
        className={`w-full h-48 bg-gradient-to-br ${gradients[index % gradients.length]} relative overflow-hidden`}
        style={{ height: item.span?.includes('row-span-2') ? '24rem' : '12rem' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl opacity-30">{item.emoji}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/20 transition-all duration-300 flex items-center justify-center">
          <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full border border-white/30 mb-2 inline-block">
            {item.category}
          </span>
          <p className="text-white font-semibold text-sm leading-tight">{item.title}</p>
        </div>
      </div>
    </motion.div>
  )
}

function Lightbox({ item, onClose, onPrev, onNext }) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-72 bg-gradient-to-br from-green-700 to-green-950 flex items-center justify-center relative">
              <span className="text-9xl opacity-30">{item.emoji}</span>
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">
                ONG Club Environnemental de Guinée — Archives photographiques terrain
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('Toutes')
  const [selectedItem, setSelectedItem] = useState(null)

  const filtered = activeFilter === 'Toutes'
    ? galleryItems
    : galleryItems.filter((g) => g.category === activeFilter)

  const handleClose = () => setSelectedItem(null)

  return (
    <>
      <SEO
        title="Galerie photos"
        description="Galerie photos de l'ONG C.E.G : actions de reboisement, formations, sensibilisation et projets communautaires en Guinée."
        keywords="galerie photos CEG Guinée, images reboisement Guinée, photos ONG environnement, activités Club Environnemental Guinée"
      />
      <MainLayout>
        <PageHero
          badge="Nos actions en images"
          title="Galerie Photos"
          subtitle="Découvrez en images les actions et projets de l'ONG C.E.G sur le terrain en République de Guinée."
          breadcrumb={['Accueil', 'Galerie']}
        />

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats bar */}
            <div className="flex items-center justify-between mb-10 bg-gray-50 rounded-2xl px-6 py-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <Images className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-sm">{galleryItems.length} photos</span>
              </div>
              <p className="text-xs text-gray-400">Cliquer sur une image pour agrandir</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {galleryCategories.map((cat) => (
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

            {/* Masonry Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[12rem]"
              >
                {filtered.map((item, i) => (
                  <GalleryItem
                    key={item.id}
                    item={item}
                    index={i}
                    onOpen={setSelectedItem}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">Aucune photo dans cette catégorie.</p>
              </div>
            )}

            {/* Upload note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportConfig}
              className="mt-16 bg-green-50 rounded-3xl p-8 text-center border border-green-100"
            >
              <p className="text-green-800 font-semibold mb-2">📸 Prêt pour vos vraies photos</p>
              <p className="text-green-600 text-sm">
                Déposez vos photos terrain dans <code className="bg-green-100 px-2 py-0.5 rounded">src/assets/images/</code> pour remplacer ces visuels de démonstration.
              </p>
            </motion.div>
          </div>
        </section>

        <Lightbox item={selectedItem} onClose={handleClose} />
      </MainLayout>
    </>
  )
}

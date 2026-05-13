import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Leaf } from 'lucide-react'
import { SEO } from '../seo/SEO'

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page introuvable" description="La page que vous cherchez n'existe pas." />
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          <div className="relative mb-8">
            <p className="font-poppins font-black text-[10rem] leading-none text-white/10 select-none">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-green-600/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-400/30">
                <Leaf className="w-12 h-12 text-green-300" />
              </div>
            </div>
          </div>

          <h1 className="font-poppins font-bold text-3xl text-white mb-4">
            Page introuvable
          </h1>
          <p className="text-green-200 mb-10 leading-relaxed">
            La page que vous cherchez n'existe pas ou a été déplacée.
            Revenez à l'accueil pour continuer votre navigation sur le site de C.E.G.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-xl"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 border border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Page précédente
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

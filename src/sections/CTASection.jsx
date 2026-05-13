import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer, viewportConfig } from '../animations/variants'
import { organization } from '../data/organization'

export function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-green-900/30"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-900/30 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <motion.span variants={fadeUp} className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
              Rejoignez notre mission
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-poppins font-bold text-4xl md:text-5xl text-white mb-6 leading-tight">
              Ensemble pour un avenir<br />
              <span className="text-green-200">durable en Guinée</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-green-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Que vous soyez partenaire, bailleur, chercheur ou citoyen engagé, votre soutien à C.E.G amplifie l'impact de nos actions environnementales sur le terrain.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-200 hover:scale-105 shadow-xl">
                <Mail className="w-5 h-5" />
                Nous contacter
              </Link>
              <a
                href={organization.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-200 border border-white/30"
              >
                <FaYoutube className="w-5 h-5" />
                Suivre nos actions
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

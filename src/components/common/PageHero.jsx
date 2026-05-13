import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../animations/variants'

export function PageHero({ badge, title, subtitle, breadcrumb }) {
  return (
    <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-950 pt-32 pb-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-green-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-300 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {badge && (
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-green-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20"
            >
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              {badge}
            </motion.span>
          )}
          <motion.h1
            variants={fadeUp}
            className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              variants={fadeUp}
              className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
          {breadcrumb && (
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-400"
            >
              {breadcrumb.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-gray-600">/</span>}
                  <span className={i === breadcrumb.length - 1 ? 'text-green-400 font-medium' : ''}>
                    {item}
                  </span>
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { fadeUp, viewportConfig } from '../../animations/variants'

export function SectionTitle({ badge, title, subtitle, center = true, light = false }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      className={`mb-12 ${center ? 'text-center' : ''}`}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-100">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          {badge}
        </span>
      )}
      <h2
        className={`font-poppins font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 ${
          light ? 'text-white' : 'text-gray-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg max-w-2xl leading-relaxed ${
            center ? 'mx-auto' : ''
          } ${light ? 'text-gray-300' : 'text-gray-500'}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

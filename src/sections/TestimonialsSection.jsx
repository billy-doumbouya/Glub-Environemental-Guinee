import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { testimonials } from '../data/testimonials'
import { SectionTitle } from '../components/common/SectionTitle'
import { staggerContainer, fadeUp, viewportConfig } from '../animations/variants'

function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 flex flex-col"
    >
      <Quote className="w-8 h-8 text-green-300 mb-6" />
      <p className="text-gray-200 leading-relaxed flex-1 mb-8 italic">
        "{testimonial.content}"
      </p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold font-poppins text-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">{testimonial.name}</p>
          <p className="text-green-300 text-sm">{testimonial.role}</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-green-900 via-green-800 to-green-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-64 h-64 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-green-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Ce que disent les bénéficiaires"
          title="Témoignages du terrain"
          subtitle="Des voix authentiques des communautés qui vivent l'impact de nos actions au quotidien."
          light
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, FolderOpen, Users, Map, Globe, Heart } from 'lucide-react'
import { statistics } from '../data/statistics'
import { useCounter } from '../hooks/useCounter'
import { staggerContainer, scaleIn } from '../animations/variants'

const iconMap = { calendar: Calendar, folder: FolderOpen, users: Users, map: Map, globe: Globe, heart: Heart }

function StatCard({ stat, isVisible }) {
  const { count, startCounting } = useCounter(stat.value, 2000)
  const started = useRef(false)

  useEffect(() => {
    if (isVisible && !started.current) {
      started.current = true
      startCounting()
    }
  }, [isVisible, startCounting])

  const Icon = iconMap[stat.icon] || Globe

  return (
    <motion.div
      variants={scaleIn}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-100 transition-all duration-300 text-center group"
    >
      <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
      <p className="font-poppins font-bold text-4xl text-green-700 mb-1">
        {count.toLocaleString('fr-FR')}{stat.suffix}
      </p>
      <p className="text-gray-500 text-sm">{stat.label}</p>
    </motion.div>
  )
}

export function StatisticsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {statistics.map((stat) => (
            <StatCard key={stat.id} stat={stat} isVisible={isInView} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

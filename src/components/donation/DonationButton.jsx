// src/components/donation/DonationButton.jsx
//
// Bouton flottant persistant — placé à GAUCHE (le chatbot KIRA est à droite)
// Visible sur toutes les pages via MainLayout.
//
// Usage dans MainLayout.jsx :
//   import { DonationButton } from '../components/donation/DonationButton'
//   <DonationButton />

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { DonationModal } from './DonationModal'

export function DonationButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating button — bottom LEFT */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="fixed bottom-5 left-4 sm:left-6 z-40"
      >
        <div className="relative group">
          {/* Tooltip */}
          <AnimatePresence>
            {!isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                Faire un don 💚
              </motion.span>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Faire un don à C.E.G"
            className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl shadow-xl shadow-rose-500/40 flex items-center justify-center border border-rose-400/30 relative"
          >
            <Heart className="w-6 h-6 text-white fill-white" />

            {/* Pulse ring */}
            <motion.span
              className="absolute inset-0 rounded-2xl border-2 border-rose-400"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Modal */}
      <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

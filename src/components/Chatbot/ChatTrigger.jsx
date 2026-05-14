// src/components/chatbot/ChatTrigger.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { X, Leaf, MessageCircle } from 'lucide-react'

export function ChatTrigger({ isOpen, unread, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir l\'assistant C.E.G'}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-xl shadow-green-900/40 flex items-center justify-center border border-green-500/30"
    >
      {/* Icon transition */}
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <X className="w-6 h-6 text-white" />
          </motion.span>
        ) : (
          <motion.span
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative"
          >
            <Leaf className="w-6 h-6 text-white" />
            {/* Unread dot */}
            {unread && (
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-green-700" />
            )}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pulse ring — only when closed */}
      {!isOpen && (
        <motion.span
          className="absolute inset-0 rounded-2xl border-2 border-green-400"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.button>
  )
}

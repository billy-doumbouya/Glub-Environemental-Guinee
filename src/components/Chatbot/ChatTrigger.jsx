// src/components/chatbot/ChatTrigger.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { AnimatedAvatar } from './AnimatedAvatar'

const AUTO_SHOW_DELAY = 2500   // délai avant affichage auto (ms)
const AUTO_HIDE_DELAY = 6000   // durée d'affichage auto avant disparition (ms)
const SESSION_KEY = 'ceg-chat-tooltip-shown'

export function ChatTrigger({ isOpen, unread, onClick }) {
  const [isHovered, setIsHovered] = useState(false)
  const [autoShow, setAutoShow] = useState(false)
  const hideTimeoutRef = useRef(null)

  // Affichage automatique une seule fois par session, au chargement
  useEffect(() => {
    if (isOpen) return
    const alreadyShown = sessionStorage.getItem(SESSION_KEY)
    if (alreadyShown) return

    const showTimer = setTimeout(() => {
      setAutoShow(true)
      sessionStorage.setItem(SESSION_KEY, '1')

      hideTimeoutRef.current = setTimeout(() => {
        setAutoShow(false)
      }, AUTO_HIDE_DELAY)
    }, AUTO_SHOW_DELAY)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Si le chat s'ouvre, on coupe immédiatement tout affichage auto
  useEffect(() => {
    if (isOpen) {
      setAutoShow(false)
      clearTimeout(hideTimeoutRef.current)
    }
  }, [isOpen])

  const showTooltip = !isOpen && (isHovered || autoShow)

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex items-center gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative bg-white text-green-900 text-sm font-medium px-4 py-2 rounded-xl shadow-lg border border-green-100 whitespace-nowrap"
          >
            Comment puis-je vous aider ?
            {/* Petite flèche pointant vers le bouton */}
            <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-r border-b border-green-100 rotate-[-45deg]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton */}
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir l\'assistant ONG C.E.G'}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-xl shadow-green-900/40 flex items-center justify-center border border-green-500/30 overflow-hidden shrink-0"
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
              <AnimatedAvatar className="w-9 h-9" />
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
    </div>
  )
}
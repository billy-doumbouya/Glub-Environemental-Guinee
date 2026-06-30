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

  useEffect(() => {
    if (isOpen) {
      setAutoShow(false)
      clearTimeout(hideTimeoutRef.current)
    }
  }, [isOpen])

  const showTooltip = !isOpen && (isHovered || autoShow)

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50">
      {/* Bulle de présentation — positionnée au-dessus du bouton, légèrement décalée à gauche */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute bottom-[68px] right-0 w-[260px]"
          >
            <div className="relative bg-emerald-50 border-2 border-slate-700 rounded-2xl px-4 py-3 shadow-lg">
              <p className="text-slate-800 text-[15px] font-semibold leading-snug">
                Bonjour ! Je suis votre Doré, assistant ONG C.E.G. Besoin d'aide ?
                Je suis là pour vous.
              </p>
              {/* Queue de la bulle, pointant vers l'avatar en bas à droite */}
              <svg
                className="absolute -bottom-[10px] right-5"
                width="24"
                height="12"
                viewBox="0 0 24 12"
              >
                <path
                  d="M0 0 L12 12 L24 0 Z"
                  fill="#ecfdf5"
                  stroke="#334155"
                  strokeWidth="2"
                />
                {/* masque pour cacher la bordure supérieure du triangle */}
                <path d="M2 0 L22 0 L12 9 Z" fill="#ecfdf5" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton / avatar */}
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir l\'assistant ONG C.E.G'}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 bg-gradient-to-br from-green-600 to-green-800 rounded-full shadow-xl shadow-green-900/40 flex items-center justify-center border border-green-500/30 overflow-hidden"
      >
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
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring — only when closed */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-green-400"
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.button>

      {/* Pastille "en ligne" — verte, en haut à droite de l'avatar, comme sur la maquette */}
      {!isOpen && (
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
      )}

      {/* Unread dot (séparé, si tu veux le garder en plus du indicateur "en ligne") */}
      {!isOpen && unread && (
        <span className="absolute top-0 right-3.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
      )}
    </div>
  )
}
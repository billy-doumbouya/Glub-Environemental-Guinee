// src/components/chatbot/QuickReplies.jsx
import { motion } from 'framer-motion'

const QUICK_REPLIES = [
  { fr: 'Quels sont vos projets ?', en: 'What are your projects?' },
  { fr: 'Comment devenir partenaire ?', en: 'How to become a partner?' },
  { fr: 'Vos domaines d\'action ?', en: 'Your intervention areas?' },
  { fr: 'Comment vous contacter ?', en: 'How to contact you?' },
]

export function QuickReplies({ onSelect, visible }) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="px-3 pb-2"
    >
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 px-1">
        Suggestions
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_REPLIES.map((q) => (
          <button
            key={q.fr}
            onClick={() => onSelect(q.fr)}
            className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-100 hover:border-green-200 px-3 py-1.5 rounded-xl transition-all duration-150 font-medium"
          >
            {q.fr}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

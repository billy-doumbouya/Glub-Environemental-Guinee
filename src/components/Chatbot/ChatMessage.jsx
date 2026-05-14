// src/components/chatbot/ChatMessage.jsx
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

/**
 * Transforme le texte brut avec **bold**, listes à puces, sauts de ligne
 * en éléments React sans dépendance externe.
 */
function parseMarkdown(text) {
  const lines = text.split('\n')
  const elements = []
  let keyCounter = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.trim() === '') {
      elements.push(<span key={keyCounter++} className="block h-2" />)
      continue
    }

    // Ligne de liste
    if (line.trim().startsWith('- ') || line.trim().startsWith('✅') || line.trim().startsWith('❌')) {
      elements.push(
        <li key={keyCounter++} className="flex items-start gap-1.5 ml-2">
          <span className="mt-1.5 w-1 h-1 bg-current rounded-full shrink-0 opacity-60" />
          <span>{parseBold(line.replace(/^[-]\s/, '').trim())}</span>
        </li>
      )
      continue
    }

    elements.push(
      <p key={keyCounter++} className="leading-relaxed">
        {parseBold(line)}
      </p>
    )
  }

  return elements
}

function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  )
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shrink-0 shadow-md mt-0.5">
          <Leaf className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-green-600 text-white rounded-tr-sm'
              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="leading-relaxed">{message.text}</p>
          ) : (
            <ul className="space-y-0.5 list-none">{parseMarkdown(message.text)}</ul>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-gray-400 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  )
}

// src/components/chatbot/ChatWindow.jsx
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, Send, Leaf, AlertCircle } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import { TypingIndicator } from './TypingIndicator'
import { QuickReplies } from './QuickReplies'

export function ChatWindow({ messages, inputValue, isLoading, error, isOpen, onClose, onReset, onInputChange, onSubmit, onKeyDown, onQuickReply }) {
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  const showQuickReplies = messages.length === 1 && !isLoading

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-gray-100 bg-[#F8FAFC]"
          style={{ maxWidth: '400px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-900 px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-poppins font-bold text-white text-sm leading-tight">KIRA</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                  <p className="text-green-200 text-[10px]">Assistante C.E.G · En ligne</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onReset}
                aria-label="Réinitialiser"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white/80" />
              </button>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide min-h-0">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            <AnimatePresence>
              {isLoading && <TypingIndicator />}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-4 py-3"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>

          {/* Quick replies — shown only at start */}
          <QuickReplies
            visible={showQuickReplies}
            onSelect={(text) => {
              onQuickReply(text)
            }}
          />

          {/* Input */}
          <div className="px-3 pb-4 pt-2 shrink-0 bg-[#F8FAFC] border-t border-gray-100">
            <form
              onSubmit={onSubmit}
              className="flex items-end gap-2 bg-white rounded-2xl border border-gray-200 shadow-sm px-3 py-2 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all"
            >
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Votre message…"
                rows={1}
                disabled={isLoading}
                aria-label="Message"
                className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none py-1.5 max-h-28 scrollbar-hide disabled:opacity-50"
                style={{ lineHeight: '1.5' }}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 112) + 'px'
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Envoyer"
                className="w-8 h-8 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-150 shrink-0 hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
            <p className="text-[9px] text-gray-300 text-center mt-2">
              KIRA · Assistante virtuelle C.E.G · Propulsé par Gemini
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

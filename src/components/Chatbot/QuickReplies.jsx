import { motion } from "framer-motion";

const QUICK_REPLIES = [
  { fr: "Quels sont vos projets ?", en: "What are your projects?" },
  { fr: "Comment devenir partenaire ?", en: "How to become a partner?" },
  { fr: "Vos domaines d'action ?", en: "Your intervention areas?" },
  { fr: "Comment vous contacter ?", en: "How to contact you?" },
];

export function QuickReplies({ onSelect, visible }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="px-3 pb-2 select-none"
    >
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5 px-1">
        Suggestions de questions
      </p>
      {/* Scroll horizontal avec scrollbar masquée pour un rendu fluide sur mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
        {QUICK_REPLIES.map((q) => (
          <button
            key={q.fr}
            type="button"
            onClick={() => onSelect(q.fr)}
            className="whitespace-nowrap text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 hover:border-emerald-300 px-3 py-1.5 rounded-xl transition-all duration-150 font-medium active:scale-95 shrink-0 shadow-sm"
          >
            {q.fr}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

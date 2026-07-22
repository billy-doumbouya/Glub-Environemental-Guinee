// src/components/chatbot/ChatTrigger.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AnimatedAvatar } from "./AnimatedAvatar";

const AUTO_SHOW_DELAY = 2500;
const AUTO_HIDE_DELAY = 6000;
// localStorage (et non sessionStorage) : le nudge ne doit s'afficher
// qu'une seule fois par utilisateur, pas à chaque nouvel onglet/session.
const STORAGE_KEY = "ceg-chat-tooltip-dismissed";

export function ChatTrigger({ isOpen, unread, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [autoShow, setAutoShow] = useState(false);

  // Miroir toujours à jour de isOpen, lisible depuis le setTimeout
  // sans dépendre d'une closure figée au montage.
  const isOpenRef = useRef(isOpen);
  // Une fois true, plus jamais de tooltip auto pour ce cycle de vie du composant.
  const suppressedRef = useRef(false);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const clearTimers = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    clearTimeout(hideTimeoutRef.current);
  }, []);

  const dismissForGood = useCallback(() => {
    suppressedRef.current = true;
    clearTimers();
    setAutoShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage indisponible (mode privé, etc.) — on ignore, le ref suffit pour la session en cours.
    }
  }, [clearTimers]);

  // Dès que le chat s'ouvre, on tue le nudge définitivement,
  // qu'un timer soit en attente ou déjà déclenché.
  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) dismissForGood();
  }, [isOpen, dismissForGood]);

  // Programme l'affichage auto, une seule fois, si l'utilisateur
  // n'a jamais ouvert le chat ni fermé la bulle auparavant.
  useEffect(() => {
    if (suppressedRef.current) return;

    let alreadyDismissed = false;
    try {
      alreadyDismissed = !!localStorage.getItem(STORAGE_KEY);
    } catch {
      alreadyDismissed = false;
    }
    if (alreadyDismissed) {
      suppressedRef.current = true;
      return;
    }

    showTimeoutRef.current = setTimeout(() => {
      // Re-vérification au moment du déclenchement : l'état a pu changer
      // pendant les 2.5s d'attente (chat ouvert entretemps, dismiss, etc.).
      if (suppressedRef.current || isOpenRef.current) return;
      setAutoShow(true);
      hideTimeoutRef.current = setTimeout(
        () => setAutoShow(false),
        AUTO_HIDE_DELAY,
      );
    }, AUTO_SHOW_DELAY);

    return () => clearTimeout(showTimeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const showTooltip = !isOpen && (isHovered || autoShow);

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50">
      {/* Bulle glassmorphism — vert de marque, transparente, floutée */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute bottom-[68px] right-0 w-[260px]"
          >
            <div className="relative bg-emerald-50/60 border border-emerald-600/40 rounded-2xl px-4 py-3 pr-8 shadow-lg shadow-emerald-900/10 backdrop-blur-md">
              <p className="text-emerald-950 text-[15px] font-semibold leading-snug drop-shadow-sm">
                Bonjour ! Je suis Doré, assistant ONG C.E.G. Besoin d'aide ? Je
                suis là pour vous.
              </p>

              {/* Fermeture explicite : dismiss permanent (standard onboarding tooltip) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  dismissForGood();
                }}
                aria-label="Fermer la suggestion"
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full text-emerald-900/60 hover:text-emerald-950 hover:bg-emerald-900/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Queue — même surface (bg + blur + bordure) que la bulle, pivotée à 45° */}
              <span
                className="absolute -bottom-[7px] right-6 w-3.5 h-3.5 bg-emerald-50/40 border-r border-b border-emerald-600/40 backdrop-blur-md rotate-45"
                aria-hidden="true"
              />
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
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir l'assistant ONG C.E.G"}
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

        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-green-400"
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.button>

      {!isOpen && (
        <span
          className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
            unread ? "bg-amber-400 right-3.5 w-3 h-3" : "bg-green-500"
          }`}
        />
      )}
    </div>
  );
}

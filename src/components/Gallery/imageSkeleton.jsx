// components/GallerySkeleton.tsx
import { motion } from "framer-motion";

const CARD_VARIANTS = [
  "h-64 w-full",      // 1
  "h-48 w-full",      // 2
  "h-80 w-full",      // 3
  "h-56 w-full",      // 4
  "h-72 w-full",      // 5
  "h-40 w-full",      // 6
  "h-96 w-full",      // 7
  "h-52 w-full",      // 8
  "h-60 w-full",      // 9
  "h-44 w-full",      // 10
  "h-68 w-full",      // 11
  "h-48 w-full",      // 12
];

export const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4">
      {Array.from({ length: 12 }).map((_, i) => {
        // On alterne les hauteurs selon une logique organique
        const heightClass = CARD_VARIANTS[i % CARD_VARIANTS.length];
        // On ajoute des coins arrondis différents pour chaque carte
        const roundedClass = [
          "rounded-3xl",
          "rounded-[2rem]",
          "rounded-xl",
          "rounded-[3rem]",
          "rounded-2xl",
          "rounded-[1.5rem]",
        ][i % 6];

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.06,
              duration: 0.5,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`relative overflow-hidden ${heightClass} ${roundedClass} bg-gradient-to-br from-gray-200/80 to-gray-300/40 dark:from-gray-800/60 dark:to-gray-700/30 shadow-xl backdrop-blur-sm border border-white/10 dark:border-white/5`}
          >
            {/* Effet de shimmer amélioré avec dégradé de couleurs de la marque */}
            <motion.div
              className="absolute inset-0 -translate-x-full"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(251, 146, 60, 0.25) 50%, rgba(250, 204, 21, 0.15) 70%, transparent 90%)",
              }}
              animate={{
                x: ["0%", "200%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.8,
                ease: "easeInOut",
                delay: i * 0.05,
              }}
            />

            {/* Pulsation lumineuse en arrière-plan */}
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-orange-400/10 blur-3xl"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 4 + (i % 3),
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />

            {/* Petit détail décoratif : une ligne subtile en bas */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400/0 via-orange-400/50 to-amber-400/0" />

            {/* Icône ou texte de placeholder (optionnel) */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400/30 dark:text-gray-500/20">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Role pour l'accessibilité */}
            <div className="sr-only">Chargement de l'image en cours…</div>
          </motion.div>
        );
      })}
    </div>
  );
};
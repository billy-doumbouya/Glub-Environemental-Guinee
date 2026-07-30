import { motion } from "framer-motion";

export function AnimatedAvatar({ className = "w-7 h-7" }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      initial={{ y: 0 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      {/* Tête */}
      <circle cx="32" cy="20" r="11" fill="#FFD9B3" />

      {/* Cheveux */}
      <path
        d="M21 17a11 11 0 0 1 22 0c-3-2-6-1-11-1s-8-1-11 1z"
        fill="#3B2A1A"
      />

      {/* Corps / Vetements base */}
      <path d="M16 58c0-12 7-19 16-19s16 7 16 19" fill="white" opacity="0.95" />

      {/* T-shirt vert aux couleurs de l'ONG */}
      <path d="M19 58c0-10 6-16 13-16s13 6 13 16" fill="#16A34A" />

      {/* Bras gauche (statique) */}
      <line
        x1="22"
        y1="46"
        x2="16"
        y2="56"
        stroke="#FFD9B3"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Bras droit qui salue */}
      <motion.g
        style={{ transformOrigin: "42px 44px" }}
        animate={{ rotate: [0, -22, 0, -22, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      >
        <line
          x1="42"
          y1="44"
          x2="48"
          y2="30"
          stroke="#FFD9B3"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="48" cy="28" r="3.2" fill="#FFD9B3" />
      </motion.g>

      {/* Yeux qui clignent */}
      <motion.g
        style={{ transformOrigin: "32px 20px" }}
        animate={{ scaleY: [1, 1, 0.1, 1] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          repeatDelay: 2,
          times: [0, 0.85, 0.9, 1],
        }}
      >
        <circle cx="28" cy="19" r="1.4" fill="#1f2937" />
        <circle cx="36" cy="19" r="1.4" fill="#1f2937" />
      </motion.g>

      {/* Sourire */}
      <path
        d="M27 23.5c2 2 8 2 10 0"
        stroke="#1f2937"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

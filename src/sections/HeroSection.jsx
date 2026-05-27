import { motion } from "framer-motion";
import { ArrowRight, Leaf, Shield, Globe, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";

import { staggerContainer, fadeUp, fadeRight } from "../animations/variants";

const features = [
  { icon: Leaf, text: "Conservation des écosystèmes" },
  { icon: Shield, text: "Développement durable" },
  { icon: Globe, text: "Impact communautaire" },
];

const stats = [
  { value: "10+", label: "Années d'action" },
  { value: "8+", label: "Projets actifs" },
  { value: "12K+", label: "Bénéficiaires" },
  { value: "3", label: "Partenaires" },
];

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* ── BACKGROUND IMAGE ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75"
        style={{ backgroundImage: "url('/ceg-bg.jpg')" }}
        aria-hidden="true"
      />

      {/* ── OVERLAY ── */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(
              105deg,
              rgba(3, 22, 14, 0.74) 0%,
              rgba(4, 32, 20, 0.58) 35%,
              rgba(5, 40, 24, 0.30) 60%,
              rgba(5, 40, 24, 0.14) 100%
            ),
            radial-gradient(
              ellipse at 50% 50%,
              transparent 42%,
              rgba(2, 12, 8, 0.36) 100%
            )
          `,
        }}
      />

      {/* ── CONTENU ── */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* ── COLONNE GAUCHE ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-white flex flex-col justify-center min-w-0"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-5 mt-2  md:mt-10">
              <span
                className="flex flex-wrap gap-1.5 w-fit mt-1  items-center gap-2 rounded-full
                           border border-green-400/30 px-4 py-2
                           text-xs font-semibold text-green-300
                           backdrop-blur-sm"
                style={{ backgroundColor: "rgba(74,222,128,0.12)" }}
              >
                {/*
                  Dot : inline-block obligatoire en Tailwind v4
                  pour que animate-pulse (opacity) s'applique.
                  framer-motion utilisé en secours garanti cross-v4.
                */}
                <motion.span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 "
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                Depuis 2016 — Forécariah, Guinée
              </span>
            </motion.div>

            {/* Titre */}
            <motion.h1
              variants={fadeUp}
              className="font-poppins font-bold
                         text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
                         leading-[1.05] mb-5 break-words"
            >
              Protéger la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
                Nature
              </span>
              , <br className="hidden sm:block" />
              Construire{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                l'Avenir
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="max-w-lg text-sm sm:text-base leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.70)" }}
            >
              ONG pionnière en Guinée pour la préservation des écosystèmes, le
              développement durable et l'amélioration des conditions de vie des
              communautés rurales.
            </motion.p>

            {/* Boutons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10"
            >
              <Link
                to="/projets"
                className="inline-flex items-center justify-center gap-2.5
                           rounded-xl bg-green-500 px-5 py-3.5
                           text-sm font-semibold text-white
                           transition-all duration-300
                           hover:bg-green-400 hover:scale-[1.02]
                           shadow-lg shadow-green-900/30"
              >
                <Package className="w-4 h-4 shrink-0" />
                Découvrir nos projets
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>

              <a
                href="https://www.youtube.com/@CEGONG"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5
                           rounded-xl border border-white/20 backdrop-blur-sm
                           px-5 py-3.5 text-sm font-semibold text-white
                           transition-all duration-300"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)")
                }
              >
                <span
                  className="flex h-7 w-7 items-center justify-center
                             rounded-lg bg-red-600 shrink-0
                             transition-transform duration-300 group-hover:scale-105"
                >
                  <FaYoutube className="text-white text-sm" />
                </span>
                Voir nos actions
              </a>
            </motion.div>

            {/* Feature pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {features.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-lg
                             border border-white/10 backdrop-blur-sm
                             px-3 py-1.5"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  <Icon className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── COLONNE DROITE : stats ── */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex flex-col items-end justify-center gap-4"
          >
            {/* Badge officiel */}
            <div className="self-end mb-2">
              <div
                className="rounded-xl px-4 py-2 text-center shadow-md backdrop-blur-sm"
                style={{ backgroundColor: "rgba(251,191,36,0.90)" }}
              >
                <p className="text-xs font-bold text-amber-900">
                  Agrément Officiel
                </p>
                <p className="text-[11px] text-amber-800">MATD 2018</p>
              </div>
            </div>

            {/* Grille stats */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/20 p-4 text-center backdrop-blur-[6px]"
                  style={{ backgroundColor: "rgba(0,0,0,0.20)" }}
                >
                  <p className="font-poppins text-2xl font-bold text-green-300 leading-none mb-1">
                    {value}
                  </p>
                  <p
                    className="text-[11px] leading-snug"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Signature ONG */}
            <div className="flex items-center gap-2.5 mt-2 self-end">
              <Leaf
                style={{ color: "rgba(74,222,128,0.70)" }}
                className="w-4 h-4"
              />
              <span
                className="text-xs tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.40)" }}
              >
                Club Environnemental de Guinée
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1.5">
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-1.5 w-0.5 rounded-full bg-white/50"
          />
        </div>
      </motion.div>
    </section>
  );
}

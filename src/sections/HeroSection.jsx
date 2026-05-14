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

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-800">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blur circle 1 */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.25, 0.15, 0.25],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 right-[-120px] md:right-10 
                     w-[260px] h-[260px] md:w-[380px] md:h-[380px] 
                     rounded-full bg-green-400/30 blur-3xl"
        />

        {/* Blur circle 2 */}
        <motion.div
          animate={{
            scale: [1.05, 1, 1.05],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-[-100px] md:left-10 
                     w-[240px] h-[240px] md:w-[320px] md:h-[320px] 
                     rounded-full bg-emerald-300/20 blur-3xl"
        />

        {/* Large animated ring */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 
                     -translate-x-1/2 -translate-y-1/2
                     w-[90vw] h-[90vw]
                     max-w-[700px] max-h-[700px]
                     border border-white/5 rounded-full"
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* LEFT */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-white min-w-0"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-6">
              <span
                className="inline-flex flex-wrap items-center gap-2 
                           rounded-full border border-green-400/30
                           bg-green-400/20 px-4 py-2
                           text-xs font-semibold text-green-300
                           backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Depuis 2016 — Forécariah, Guinée
              </span>
            </motion.div>

            {/* TITLE */}
            <motion.h1
              variants={fadeUp}
              className="font-poppins font-bold 
                         text-4xl sm:text-5xl lg:text-7xl
                         leading-tight lg:leading-none
                         mb-6 break-words"
            >
              Protéger la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
                Nature
              </span>
              ,
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              Construire{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                l'Avenir
              </span>
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-base sm:text-lg text-gray-300 leading-relaxed mb-10"
            >
              ONG pionnière en Guinée pour la préservation des écosystèmes, le
              développement durable et l'amélioration des conditions de vie des
              communautés rurales.
            </motion.p>

            {/* BUTTONS */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row flex-wrap gap-4 mb-12"
            >
              <Link
                to="/projets"
                className="inline-flex items-center justify-center gap-3
                           rounded-2xl bg-green-500 px-6 py-4
                           text-white font-semibold
                           transition-all duration-300
                           hover:bg-green-400 hover:scale-[1.02]
                           shadow-2xl shadow-green-900/40"
              >
                <Package className="w-5 h-5 shrink-0" />

                <span className="truncate">Découvrir nos projets</span>

                <ArrowRight className="w-5 h-5 shrink-0" />
              </Link>

              <a
                href="https://www.youtube.com/@CEGONG"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3
                           rounded-2xl border border-white/20
                           bg-white/10 backdrop-blur-md
                           px-6 py-4 text-white font-semibold
                           transition-all duration-300
                           hover:bg-white/20"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center
                             rounded-xl bg-red-600
                             transition-transform duration-300
                             group-hover:scale-105 shrink-0"
                >
                  <FaYoutube className="text-white text-xl" />
                </span>

                <span className="truncate">Voir nos actions</span>
              </a>
            </motion.div>

            {/* FEATURES */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {features.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="inline-flex items-center gap-2
                             rounded-xl border border-white/10
                             bg-white/5 backdrop-blur-sm
                             px-4 py-2"
                >
                  <Icon className="w-4 h-4 text-green-400 shrink-0" />

                  <span className="text-sm text-white/80">{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="hidden lg:block min-w-0"
          >
            <div className="relative max-w-lg mx-auto">
              {/* CARD */}
              <div
                className="rounded-3xl border border-white/20
                           bg-white/10 backdrop-blur-xl
                           p-8 shadow-2xl overflow-hidden"
              >
                {/* Top visual */}
                <div
                  className="relative mb-6 h-64 overflow-hidden
                             rounded-2xl bg-gradient-to-br
                             from-green-800 to-green-950"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl opacity-20">🌿</div>
                  </div>

                  <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
                    <Leaf className="w-16 h-16 text-green-300 mb-3" />

                    <p className="text-lg font-semibold text-white">C.E.G</p>

                    <p className="text-sm text-green-300">
                      Club Environnemental de Guinée
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "8+", label: "Années" },
                    { value: "15+", label: "Projets" },
                    { value: "12K+", label: "Bénéficiaires" },
                    { value: "3", label: "Partenaires" },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className="rounded-xl bg-white/5 p-4 text-center"
                    >
                      <p className="font-poppins text-2xl font-bold text-green-300">
                        {value}
                      </p>

                      <p className="mt-1 text-xs text-white/60">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-4 right-4
                           rounded-2xl bg-amber-400
                           px-4 py-2 text-white shadow-lg"
              >
                <p className="text-sm font-bold">Agrément Officiel</p>

                <p className="text-xs text-amber-100">MATD 2018</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div
          className="flex h-10 w-6 items-start justify-center
                     rounded-full border-2 border-white/30 p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  );
}

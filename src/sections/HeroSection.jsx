import { motion } from "framer-motion";
import { ArrowRight, Play, Leaf, Shield, Globe, Package } from "lucide-react";
import { Link } from "react-router-dom";
import {
  staggerContainer,
  fadeUp,
  fadeLeft,
  fadeRight,
} from "../animations/variants";
import { FaYoutube } from "react-icons/fa";

const features = [
  { icon: Leaf, text: "Conservation des écosystèmes" },
  { icon: Shield, text: "Développement durable" },
  { icon: Globe, text: "Impact communautaire" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-green-950 via-green-900 to-green-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-96 h-96 bg-green-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.3, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-300 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-white"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-green-400/20 backdrop-blur-sm text-green-300 text-xs font-semibold px-4 py-2 rounded-full border border-green-400/30">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Depuis 2016 — Forécariah, Guinée
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-poppins font-bold text-5xl md:text-6xl lg:text-7xl leading-none mb-6"
            >
              Protéger la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
                Nature
              </span>
              ,<br />
              Construire{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                l'Avenir
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-gray-300 text-lg leading-relaxed mb-10 max-w-xl"
            >
              ONG pionnière en Guinée pour la préservation des écosystèmes, le
              développement durable et l'amélioration des conditions de vie des
              communautés rurales.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                to="/projets"
                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-200 hover:scale-105 shadow-2xl shadow-green-900/50"
              >
                <Package className="w-5 h-5" />
                Découvrir nos projets
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://www.youtube.com/@CEGONG"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md hover:bg-white/20 
             text-white px-8 py-4 rounded-2xl font-semibold text-base 
             border border-white/20 transition-all duration-300 group"
              >
                {/* Icon container */}
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 
               group-hover:scale-105 transition"
                >
                  <FaYoutube className="text-white text-xl" />
                </span>

                <span>Voir nos actions</span>
              </a>
            </motion.div>

            {/* Features */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              {features.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2"
                >
                  <Icon className="w-4 h-4 text-green-400" />
                  <span className="text-white/80 text-sm">{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="bg-gradient-to-br from-green-800 to-green-950 rounded-2xl h-64 flex items-center justify-center mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl opacity-30">🌿</div>
                  </div>
                  <div className="relative text-center">
                    <Leaf className="w-16 h-16 text-green-300 mx-auto mb-3" />
                    <p className="text-white font-semibold text-lg">C.E.G</p>
                    <p className="text-green-300 text-sm">
                      Club Environnemental de Guinée
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "8+", label: "Années" },
                    { value: "15+", label: "Projets" },
                    { value: "12K+", label: "Bénéficiaires" },
                    { value: "3", label: "Partenaires" },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className="bg-white/5 rounded-xl p-4 text-center"
                    >
                      <p className="font-bold text-2xl text-green-300 font-poppins">
                        {value}
                      </p>
                      <p className="text-white/60 text-xs mt-1">{label}</p>
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
                className="absolute -top-4 -right-4 bg-amber-400 text-white rounded-2xl px-4 py-2 shadow-lg"
              >
                <p className="font-bold text-sm">Agrément Officiel</p>
                <p className="text-amber-100 text-xs">MATD 2018</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: "10+", label: "Années d'action" },
  { value: "8+", label: "Projets actifs" },
  { value: "12K+", label: "Bénéficiaires" },
  { value: "3", label: "Partenaires" },
];

const impactBars = [
  { label: "Environnement", pct: 72 },
  { label: "Éducation", pct: 55 },
  { label: "Communauté", pct: 88 },
];

const features = [
  {
    icon: (
      <svg
        className="w-3.5 h-3.5 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9S3 15.97 3 11A9 9 0 0 1 12 2z" />
        <path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83" />
      </svg>
    ),
    text: "Conservation des écosystèmes",
  },
  {
    icon: (
      <svg
        className="w-3.5 h-3.5 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    text: "Développement durable",
  },
  {
    icon: (
      <svg
        className="w-3.5 h-3.5 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    text: "Impact communautaire",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#03160e] flex flex-col">
      {/* ── BACKGROUND PHOTO ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/ceg-bg.jpg')" }}
        aria-hidden="true"
      />

      {/* ── OVERLAY ── */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(160deg,
              rgba(3,22,14,0.92) 0%,
              rgba(6,45,24,0.80) 40%,
              rgba(3,22,14,0.70) 100%
            ),
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(16,120,60,0.15) 0%, transparent 70%)
          `,
        }}
      />

      {/* ── AMBIENT ORBS ── */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "rgba(22,163,74,0.10)", filter: "blur(80px)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 -left-16 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "rgba(16,185,129,0.07)", filter: "blur(80px)" }}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex flex-col min-h-screen w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* ── TOP BAR ── */}
        <div className="flex justify-between items-center pt-5 pb-0">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-base">
              🌿
            </div>
            <div>
              <p className="font-poppins font-bold text-sm text-white leading-tight tracking-wide">
                CEG
              </p>
              <p className="text-[10px] text-white/40 leading-none tracking-widest">
                Guinée · Depuis 2016
              </p>
            </div>
          </div>

          {/* Badge agrément */}
          <div
            className="rounded-xl px-3 py-1.5 text-center border"
            style={{
              background: "rgba(251,191,36,0.10)",
              borderColor: "rgba(251,191,36,0.25)",
            }}
          >
            <p className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">
              Agrément Officiel
            </p>
            <p className="text-[9px] text-amber-400/60 mt-0.5">MATD · 2018</p>
          </div>
        </div>

        {/* ── HERO BODY ── */}
        <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-14 py-10 lg:py-0">
          {/* ── LEFT COLUMN ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col text-white lg:flex-1 min-w-0"
          >
            {/* Live badge */}
            <motion.div variants={fadeUp} className="mb-6">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border text-[11px] font-semibold text-green-400 uppercase tracking-widest"
                style={{
                  background: "rgba(22,163,74,0.10)",
                  borderColor: "rgba(22,163,74,0.25)",
                }}
              >
                <motion.span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.85, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                Forécariah, Guinée
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-poppins font-extrabold leading-[1.0] mb-3 tracking-tight"
              style={{ fontSize: "clamp(38px, 9vw, 76px)" }}
            >
              Protéger la
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">
                Nature,
              </span>
              <br />
              Construire
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                l'Avenir.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-poppins font-semibold text-white/30 mb-6 tracking-tight"
              style={{ fontSize: "clamp(13px, 3vw, 18px)" }}
            >
              Club Environnemental de Guinée
            </motion.p>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base leading-relaxed text-white/60 mb-7 max-w-md border-l-2 border-green-500/30 pl-4"
            >
              ONG pionnière pour la préservation des écosystèmes, le
              développement durable et l'amélioration des conditions de vie des
              communautés rurales de Guinée.
            </motion.p>

            {/* ── STATS STRIP — mobile only, visible on all screens < lg ── */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-4 lg:hidden mb-7 rounded-2xl overflow-hidden border border-white/[0.07]"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {stats.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="py-3 px-1 text-center"
                  style={{
                    borderRight:
                      i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <p
                    className="font-poppins font-bold text-green-400 leading-none mb-1"
                    style={{ fontSize: "clamp(16px, 4vw, 22px)" }}
                  >
                    {value}
                  </p>
                  <p className="text-[9px] text-white/35 leading-tight">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row flex-wrap gap-3 mb-7"
            >
              <Link
                to="/projets"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                  boxShadow:
                    "0 0 0 1px rgba(22,163,74,0.4), 0 8px 24px rgba(5,150,105,0.25)",
                }}
              >
                <Package className="w-4 h-4 shrink-0" />
                Découvrir nos projets
                <ArrowRight className="w-4 h-4 shrink-0 opacity-70" />
              </Link>

              <a
                href="https://www.youtube.com/@CEGONG"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 text-sm font-semibold text-white/85 border transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.14)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                }}
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-[7px] bg-red-600 shrink-0">
                  <FaYoutube className="text-white text-sm" />
                </span>
                Voir nos actions
              </a>
            </motion.div>

            {/* Feature pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {features.map(({ icon, text }) => (
                <div
                  key={text}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.09)",
                  }}
                >
                  <span className="text-green-400">{icon}</span>
                  <span className="text-[11px] text-white/60 font-medium">
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN — desktop only ── */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex flex-col gap-3 w-[288px] flex-shrink-0"
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border p-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="font-poppins font-bold text-green-400 text-2xl leading-none mb-1.5">
                    {value}
                  </p>
                  <p className="text-[11px] text-white/40 leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Impact card */}
            <div
              className="rounded-2xl border p-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 font-semibold">
                Axes d'impact
              </p>
              <div className="flex flex-col gap-3">
                {impactBars.map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-white/50">{label}</span>
                      <span className="text-green-400 font-semibold">
                        {pct}%
                      </span>
                    </div>
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, #16a34a, #4ade80)",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 1,
                          delay: 0.8,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature */}
            <div className="flex items-center gap-2 self-end">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "rgba(74,222,128,0.40)" }}
              />
              <span className="text-[10px] uppercase tracking-widest text-white/20">
                Club Environnemental de Guinée
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="flex justify-between items-center py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="text-[10px] uppercase tracking-widest text-white/20">
            © 2016 – 2025 CEG · Forécariah
          </span>

          {/* Scroll hint */}
          <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/20">
            <div className="relative w-6 h-px bg-white/15 overflow-hidden">
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40"
                animate={{ x: [0, 20, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            Défiler
          </div>
        </div>
      </div>
    </section>
  );
}

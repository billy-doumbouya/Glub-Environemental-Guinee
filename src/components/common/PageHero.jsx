import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../animations/variants";

export function PageHero({ badge, title, subtitle, breadcrumb, bgImage }) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 mt-20">
      {/* =========================
          BACKGROUND IMAGE
      ========================== */}
      {bgImage ? (
        <>
          {/* Image */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url('${bgImage}')`,
            }}
            aria-hidden="true"
          />

          {/* Base dark overlay */}
          <div
            className="
              absolute inset-0
              bg-black/10
            "
            aria-hidden="true"
          />

          {/* Brand cinematic gradient */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-br
              from-green-950/80
              via-green-950/60
              to-emerald-900/50
            "
            aria-hidden="true"
          />

          {/* Radial focus light */}
          <div
            className="
              absolute inset-0
              bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_55%)]
            "
            aria-hidden="true"
          />

          {/* Bottom fade */}
          <div
            className="
              absolute inset-x-0 bottom-0 h-40
              bg-gradient-to-t from-[#020617] to-transparent
            "
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          {/* Luxury gradient background */}
          <div
            className="
              absolute inset-0
              bg-[linear-gradient(135deg,#022c22_0%,#052e16_35%,#021617_100%)]
            "
            aria-hidden="true"
          />

          {/* Glow orbs */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div
              className="
                absolute -top-24 left-0
                w-[500px] h-[500px]
                bg-emerald-500/20
                rounded-full blur-3xl
              "
            />

            <div
              className="
                absolute bottom-0 right-0
                w-[450px] h-[450px]
                bg-green-400/10
                rounded-full blur-3xl
              "
            />
          </div>

          {/* Mesh effect */}
          <div
            className="
              absolute inset-0
              bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_30%)]
            "
            aria-hidden="true"
          />
        </>
      )}

      {/* =========================
          GLOBAL NOISE / GRID
      ========================== */}

      {/* Dot pattern */}
      <div
        className="
          absolute inset-0
          opacity-[0.05]
          pointer-events-none
        "
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Noise texture */}
      <div
        className="
    absolute inset-0
    opacity-[0.035]
    pointer-events-none
    mix-blend-soft-light
  "
        style={{
          backgroundImage: `
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E")
    `,
        }}
      />

      {/* =========================
          CONTENT
      ========================== */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          {badge && (
            <motion.div variants={fadeUp}>
              <span
                className="
                  inline-flex items-center gap-2
                  px-5 py-2
                  rounded-full
                  border border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  shadow-[0_0_30px_rgba(16,185,129,0.12)]
                  text-green-200
                  text-xs
                  tracking-[0.2em]
                  uppercase
                  font-semibold
                  mb-8
                "
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {badge}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="
              font-poppins
              font-black
              text-white
              leading-[0.95]
              tracking-tight
              text-5xl
              md:text-6xl
              lg:text-7xl
              mb-8
            "
          >
            <span className="bg-gradient-to-b from-white via-white to-gray-300 bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              variants={fadeUp}
              className="
                text-base
                md:text-xl
                leading-relaxed
                text-gray-300/90
                max-w-2xl
                mx-auto
              "
            >
              {subtitle}
            </motion.p>
          )}

          {/* Breadcrumb */}
          {breadcrumb && (
            <motion.div
              variants={fadeUp}
              className="
                mt-10
                flex items-center justify-center
                flex-wrap gap-3
                text-sm
              "
            >
              {breadcrumb.map((item, i) => (
                <span
                  key={i}
                  className="
                    flex items-center gap-3
                    text-gray-400
                  "
                >
                  {i > 0 && <span className="text-green-500/50">•</span>}

                  <span
                    className={
                      i === breadcrumb.length - 1
                        ? "text-emerald-400 font-medium"
                        : "hover:text-white transition-colors duration-300"
                    }
                  >
                    {item}
                  </span>
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

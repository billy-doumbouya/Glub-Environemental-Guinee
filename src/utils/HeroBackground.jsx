// src/components/home/HeroBackground.jsx

export function HeroBackground({ bgImage }) {
  const src = bgImage || "/ceg-bg.jpg"; // fallback sur l'image statique existante

  return (
    <>
      {/* ─────────────────────────────────────────
          MOBILE : image top 50vh + fond sombre bas
          ───────────────────────────────────────── */}
      <div className="absolute inset-0 lg:hidden" aria-hidden="true">
        {/* Photo haut */}
        <div className="absolute top-0 left-0 right-0 h-[50vh]">
          <img
            src={src}
            alt=""
            fetchPriority="high"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg,
                rgba(3,22,14,0.72) 0%,
                rgba(3,22,14,0.55) 50%,
                rgba(3,22,14,0.90) 85%,
                #03160e 100%
              )`,
            }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-[#03160e]" />

        <div
          className="absolute left-1/2 -translate-x-1/2 w-[260px] h-[60px] pointer-events-none"
          style={{
            top: "calc(50vh - 30px)",
            background: "rgba(22,163,74,0.10)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* ─────────────────────────────────────────
          DESKTOP : image plein écran + overlay original
          ───────────────────────────────────────── */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
        <img
          src={src}
          alt=""
          fetchPriority="high"
          className="w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
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
      </div>

      {/* Orbs desktop */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none hidden lg:block"
        style={{ background: "rgba(22,163,74,0.10)", filter: "blur(80px)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 -left-16 w-[300px] h-[300px] rounded-full pointer-events-none hidden lg:block"
        style={{ background: "rgba(16,185,129,0.07)", filter: "blur(80px)" }}
      />
    </>
  );
}

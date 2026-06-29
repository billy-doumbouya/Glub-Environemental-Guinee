import { motion } from "framer-motion";
import { Leaf, Users, Heart, BookOpen, CheckCircle } from "lucide-react";
import { fadeLeft, fadeRight, viewportConfig } from "../../animations/variants";

const iconMap = { leaf: Leaf, users: Users, heart: Heart, book: BookOpen };

const clipShapes = [
  "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 15% 100%, 0 85%)",
  "polygon(0 8%, 50% 0, 100% 8%, 100% 92%, 50% 100%, 0 92%)",
  "polygon(0 0, 92% 0, 100% 8%, 100% 100%, 8% 100%, 0 92%)",
  "polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)",
];

// Clip-path des séparateurs de section
const sectionDividers = [
  "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
  "polygon(0 15%, 50% 0, 100% 15%, 100% 100%, 0 100%)",
  "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
  "polygon(0 15%, 50% 0, 100% 15%, 100% 100%, 0 100%)",
];

export function DomainDetailSection({ domain, index }) {
  const Icon = iconMap[domain.icon] || Leaf;
  const isEven = index % 2 === 0;
  const clip = clipShapes[index % clipShapes.length];
  const divider = sectionDividers[index % sectionDividers.length];

  return (
    <section
      id={domain.slug}
      className="relative overflow-hidden"
      style={{
        backgroundColor: isEven ? "#ffffff" : "#f9fafb",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      {/* Séparateur haut en clip-path */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "60px",
          clipPath: divider,
          background: isEven
            ? "linear-gradient(90deg, #f0fdf4, #dcfce7, #f0fdf4)"
            : "linear-gradient(90deg, #ffffff, #f0fdf4, #ffffff)",
          opacity: 0.6,
        }}
      />

      {/* Grand clip-path décoratif en arrière-plan */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          clipPath: clip,
          background: `linear-gradient(135deg, ${domain.color}08, ${domain.color}03)`,
        }}
      />

      {/* Orbe coloré positionné selon index */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${domain.color}10 0%, transparent 70%)`,
          top: isEven ? "-100px" : "auto",
          bottom: isEven ? "auto" : "-100px",
          right: isEven ? "-100px" : "auto",
          left: isEven ? "auto" : "-100px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid lg:grid-cols-2 gap-16 items-center ${!isEven ? "lg:grid-flow-col-dense" : ""}`}
        >
          {/* Contenu textuel */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className={!isEven ? "lg:col-start-2" : ""}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: domain.bgColor,
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <Icon className="w-8 h-8" style={{ color: domain.color }} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Domaine {String(index + 1).padStart(2, "0")}
                </span>
                <div
                  className="h-0.5 mt-1 rounded-full"
                  style={{ width: "40px", background: domain.color }}
                />
              </div>
            </div>

            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
              {domain.title}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8 text-lg">
              {domain.description}
            </p>

            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div
                className="w-1 h-4 rounded-full"
                style={{ background: domain.color }}
              />
              Activités principales
            </h3>
            <ul className="space-y-3 mb-8">
              {(domain.activities || []).map((activity) => (
                <li key={activity} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: domain.color }}
                  />
                  <span className="text-gray-600 text-sm">{activity}</span>
                </li>
              ))}
            </ul>

            {/* Impact card avec clip-path */}
            <div
              className="p-5 relative overflow-hidden"
              style={{
                backgroundColor: domain.bgColor,
                borderLeft: `4px solid ${domain.color}`,
                clipPath: "polygon(0 0, 100% 0, 98% 50%, 100% 100%, 0 100%)",
                paddingRight: "32px",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: domain.color }}
              >
                Impact mesuré
              </p>
              <p className="font-semibold text-gray-900">{domain.impact}</p>
            </div>
          </motion.div>

          {/* Visuel clippé */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}
          >
            <div style={{ position: "relative", height: "420px" }}>
              {/* Ombre décalée couche 1 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: clip,
                  background: domain.color,
                  opacity: 0.08,
                  transform: "translate(20px, 20px)",
                }}
              />

              {/* Ombre décalée couche 2 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: clip,
                  background: domain.color,
                  opacity: 0.15,
                  transform: "translate(10px, 10px)",
                }}
              />

              {/* Bloc principal */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: clip,
                  background: `linear-gradient(135deg, ${domain.color}, ${domain.color}99)`,
                }}
              >
                {/* Motif pointillé */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.12,
                    backgroundImage:
                      "radial-gradient(circle, white 1.5px, transparent 1.5px)",
                    backgroundSize: "22px 22px",
                  }}
                />

                {/* Lignes diagonales décoratives */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.05,
                    backgroundImage: `repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 20px)`,
                  }}
                />

                {/* Orbes internes */}
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -20,
                    left: -20,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.10)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.04)",
                  }}
                />

                {/* Contenu */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                      clipPath:
                        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    <Icon style={{ width: 48, height: 48 }} />
                  </div>

                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                      marginBottom: 8,
                      lineHeight: 1.3,
                    }}
                  >
                    {domain.shortTitle}
                  </p>

                  {/* Séparateur décoratif */}
                  <div
                    style={{
                      width: 40,
                      height: 2,
                      background: "rgba(255,255,255,0.5)",
                      borderRadius: 2,
                      marginBottom: 16,
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      justifyContent: "center",
                    }}
                  >
                    {(domain.activities || []).slice(0, 3).map((a) => (
                      <span
                        key={a}
                        style={{
                          fontSize: 11,
                          padding: "4px 12px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(6px)",
                          border: "1px solid rgba(255,255,255,0.3)",
                        }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

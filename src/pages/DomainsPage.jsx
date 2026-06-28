import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Users, Heart, BookOpen, CheckCircle } from "lucide-react";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { domainsService } from "../../api/services";
import { staggerContainer, fadeUp, fadeLeft, fadeRight, viewportConfig } from "../animations/variants";

const iconMap = { leaf: Leaf, users: Users, heart: Heart, book: BookOpen };

const clipShapes = [
  "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
  "polygon(50% 0, 100% 20%, 100% 100%, 0 100%, 0 20%)",
  "polygon(0 0, 100% 0, 100% 80%, 75% 100%, 25% 100%, 0 80%)",
  "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
];

function DomainDetail({ domain, index }) {
  const Icon = iconMap[domain.icon] || Leaf;
  const isEven = index % 2 === 0;
  const clip = clipShapes[index % clipShapes.length];

  return (
    <section
      id={domain.slug}
      className={`py-24 relative overflow-hidden ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${!isEven ? "lg:grid-flow-col-dense" : ""}`}>

          {/* Contenu */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className={!isEven ? "lg:col-start-2" : ""}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: domain.bgColor }}>
                <Icon className="w-8 h-8" style={{ color: domain.color }} />
              </div>
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Domaine {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
              {domain.title}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8 text-lg">{domain.description}</p>
            <h3 className="font-semibold text-gray-900 mb-4">Activités principales</h3>
            <ul className="space-y-3 mb-8">
              {(domain.activities || []).map((activity) => (
                <li key={activity} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: domain.color }} />
                  <span className="text-gray-600 text-sm">{activity}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: domain.bgColor, borderColor: `${domain.color}30` }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: domain.color }}>
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
            <div className="relative" style={{ height: "380px" }}>
              {/* Ombre décalée */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: clip,
                  background: domain.color,
                  opacity: 0.25,
                  transform: "translate(12px, 12px)",
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
                    backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                {/* Orbes */}
                <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                <div style={{ position: "absolute", bottom: -20, left: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.10)" }} />

                {/* Contenu */}
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center", color: "white" }}>
                  <div style={{
                    width: 88, height: 88, borderRadius: 24,
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  }}>
                    <Icon style={{ width: 44, height: 44 }} />
                  </div>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 16, lineHeight: 1.3 }}>
                    {domain.shortTitle}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                    {(domain.activities || []).slice(0, 3).map((a) => (
                      <span key={a} style={{
                        fontSize: 11, padding: "4px 12px", borderRadius: 999,
                        background: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(6px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}>
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

export default function DomainsPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    domainsService.getAll()
      .then((res) => setDomains(res.data.data || []))
      .catch((err) => console.error("Erreur chargement domaines :", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Domaines d'intervention"
        description="Les 4 domaines d'intervention de C.E.G : Environnement et Développement Durable, Genre et Gouvernance, Santé Communautaire, Recherche et Formation en Guinée."
        keywords="domaines intervention CEG, environnement développement durable Guinée, genre gouvernance locale, santé communautaire Guinée, recherche formation environnement"
      />
      <MainLayout>
        <PageHero
          badge="4 piliers d'action stratégique"
          bgImage="/ceg-bg-domaines.jpg"
          title="Domaines d'intervention"
          subtitle="C.E.G intervient sur quatre axes complémentaires pour un impact durable, mesurable et pérenne sur les communautés et l'environnement guinéen."
          breadcrumb={["Accueil", "Domaines"]}
        />

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {domains.map((domain) => {
                  const Icon = iconMap[domain.icon] || Leaf;
                  return (
                    <motion.a
                      key={domain._id}
                      href={`#${domain.slug}`}
                      variants={fadeUp}
                      className="group rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg text-center"
                      style={{ backgroundColor: domain.bgColor, borderColor: `${domain.color}20` }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${domain.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: domain.color }} />
                      </div>
                      <p className="font-semibold text-gray-900 text-sm leading-tight">{domain.shortTitle}</p>
                    </motion.a>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {!loading && domains.map((domain, i) => (
          <DomainDetail key={domain._id} domain={domain} index={i} />
        ))}
      </MainLayout>
    </>
  );
}
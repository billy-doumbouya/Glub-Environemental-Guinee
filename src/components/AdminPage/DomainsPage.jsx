import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Users, Heart, BookOpen, CheckCircle } from "lucide-react";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { SectionTitle } from "../components/common/SectionTitle";
import { domainsService } from "../../api/services";
import {
  staggerContainer, fadeUp, fadeLeft, fadeRight, viewportConfig,
} from "../animations/variants";

const iconMap = { leaf: Leaf, users: Users, heart: Heart, book: BookOpen };

// Clip-paths alternés — un par section
const clipShapes = [
  "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 15% 100%, 0 85%)",
  "polygon(0 8%, 50% 0, 100% 8%, 100% 92%, 50% 100%, 0 92%)",
  "polygon(0 0, 92% 0, 100% 8%, 100% 100%, 8% 100%, 0 92%)",
  "polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)",
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
      {/* Clip-path décoratif en arrière-plan */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          clipPath: clip,
          background: `linear-gradient(135deg, ${domain.color}, ${domain.color}88)`,
        }}
      />

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

          {/* Visuel avec clip-path */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}
          >
            {/* Conteneur externe — clip-path impressionnant */}
            <div className="relative">
              {/* Ombre décalée derrière */}
              <div
                className="absolute inset-0 translate-x-4 translate-y-4 opacity-30"
                style={{
                  clipPath: clip,
                  background: domain.color,
                  borderRadius: "4px",
                }}
              />

              {/* Bloc principal clippé */}
              <div
                className="relative h-96 flex items-center justify-center overflow-hidden"
                style={{
                  clipPath: clip,
                  background: `linear-gradient(135deg, ${domain.color}ee, ${domain.color}88)`,
                }}
              >
                {/* Motif de fond */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle, white 1.5px, transparent 1.5px)`,
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Cercle décoratif */}
                <div
                  className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full opacity-20"
                  style={{ background: "rgba(255,255,255,0.3)" }}
                />
                <div
                  className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-15"
                  style={{ background: "rgba(255,255,255,0.4)" }}
                />

                {/* Contenu centré */}
                <div className="relative text-center text-white p-8 z-10">
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl"
                    style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)" }}
                  >
                    <Icon className="w-12 h-12" />
                  </div>
                  <p className="font-poppins font-bold text-xl mb-4 leading-tight">
                    {domain.shortTitle}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(domain.activities || []).slice(0, 3).map((a) => (
                      <span key={a} className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
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

        {/* Intro grid */}
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

        {/* Sections détail */}
        {!loading && domains.map((domain, i) => (
          <DomainDetail key={domain._id} domain={domain} index={i} />
        ))}
      </MainLayout>
    </>
  );
}
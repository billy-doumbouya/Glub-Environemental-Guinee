import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Globe, Users, Target } from "lucide-react";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { partnersService } from "../../api/services";
import {
  staggerContainer,
  fadeUp,
  fadeLeft,
  fadeRight,
  viewportConfig,
} from "../animations/variants";

const clipShapes = [
  "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
  "polygon(50% 0, 100% 25%, 100% 100%, 0 100%, 0 25%)",
  "polygon(0 0, 100% 0, 100% 80%, 75% 100%, 25% 100%, 0 80%)",
];

function PartnerFullCard({ partner, index }) {
  const isEven = index % 2 === 0;
  const clip = clipShapes[index % clipShapes.length];
  const logoUrl = partner.logo?.url ?? partner.logo ?? null;

  return (
    <div
      id={partner.slug}
      className={`py-20 scroll-mt-24 ${isEven ? "bg-white" : "bg-gray-50"}`} // Modification ici (scroll-mt-24)
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <div
          className={`grid lg:grid-cols-2 gap-16 items-center ${!isEven ? "lg:grid-flow-col-dense" : ""}`}
        >
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className={!isEven ? "lg:col-start-2" : ""}
          >
            <div className="flex items-center gap-5 mb-8">
              <div
                className="h-20 w-40 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg bg-white" // Ajout de bg-white par défaut au cas où
                style={{
                  backgroundColor: partner.logoColor
                    ? `${partner.logoColor}15`
                    : undefined,
                }}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={partner.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span
                    className="text-4xl font-black font-poppins"
                    style={{ color: partner.logoColor }}
                  >
                    {partner.name}
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">
                  {partner.category}
                </span>
                <h2 className="font-poppins font-bold text-2xl text-gray-900">
                  {partner.name}
                </h2>
                <p className="text-gray-500 text-sm">{partner.fullName}</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {partner.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Type de partenariat</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {partner.partnership}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <Target className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Partenaire depuis</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {partner.since}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {(partner.domains || []).map((d) => (
                <span
                  key={d}
                  className="text-sm px-4 py-1.5 rounded-full font-medium"
                  style={{
                    backgroundColor: partner.logoColor
                      ? `${partner.logoColor}12`
                      : undefined,
                    color: partner.logoColor,
                  }}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* CORRECTION ICI : Balise <a> corrigée (elle était tronquée / cassée) */}
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ backgroundColor: partner.logoColor || "#22c55e" }}
              >
                <Globe className="w-4 h-4" />
                Visiter le site officiel
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </motion.div>

          {/* Visuel clippé */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}
          >
            <div style={{ position: "relative", height: 360 }}>
              {/* Ombre */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: clip,
                  background: partner.logoColor || "#22c55e",
                  opacity: 0.2,
                  transform: "translate(14px, 14px)",
                }}
              />
              {/* Bloc principal */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: clip,
                  background: `linear-gradient(135deg, ${partner.logoColor || "#22c55e"}ee, ${partner.logoColor || "#22c55e"}88)`,
                }}
              >
                {/* Motif */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage:
                      "radial-gradient(circle, white 1.5px, transparent 1.5px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                {/* Orbes */}
                <div
                  style={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.12)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -20,
                    left: -20,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
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
                    padding: 40,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 900,
                      fontSize: 64,
                      opacity: 0.15,
                      position: "absolute",
                    }}
                  >
                    {partner.name}
                  </p>
                  <div style={{ position: "relative" }}>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 900,
                        fontSize: 52,
                        lineHeight: 1,
                      }}
                    >
                      {partner.name}
                    </p>
                    <p
                      style={{
                        opacity: 0.8,
                        fontSize: 13,
                        fontWeight: 500,
                        marginTop: 8,
                      }}
                    >
                      {partner.fullName}
                    </p>
                    <div
                      style={{
                        marginTop: 20,
                        background: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(8px)",
                        borderRadius: 16,
                        padding: "12px 24px",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                    >
                      <p style={{ fontWeight: 700, fontSize: 18 }}>
                        Depuis {partner.since}
                      </p>
                      <p style={{ opacity: 0.7, fontSize: 11, marginTop: 2 }}>
                        Partenariat actif
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    partnersService
      .getAll()
      .then((res) => setPartners(res.data.data || []))
      .catch((err) => console.error("Erreur chargement partenaires :", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Partenaires"
        description="Les partenaires institutionnels de ONG C.E.G : GEF, PNUD-GUINEE, SGP/FEM."
        keywords="partenaires CEG Guinée, GEF Guinée, PNUD-Guinée, SGP FEM Guinée, partenariat ONG environnement"
      />
      <MainLayout>
        <PageHero
          badge="Partenaires de confiance"
          bgImage="/ceg-bg-partenaires.jpg"
          title="Nos Partenaires Financiers"
          subtitle="ONG C.E.G collabore avec des organisations internationales reconnues qui garantissent la qualité, la transparence et l'impact de nos interventions."
          breadcrumb={["Accueil", "Partenaires"]}
        />

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-gray-100 animate-pulse rounded-3xl"
                  />
                ))}
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              >
                {partners.map((p) => {
                  const logoUrl = p.logo?.url ?? p.logo ?? null;
                  return (
                    <motion.a
                      key={p._id}
                      href={`#${p.slug}`}
                      variants={fadeUp}
                      className="group relative bg-white rounded-3xl border border-gray-100 hover:shadow-2xl hover:border-transparent hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      <div
                        className="h-1 w-full"
                        style={{ backgroundColor: p.logoColor || "#22c55e" }}
                      />
                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden border bg-white"
                            style={{
                              backgroundColor: p.logoColor
                                ? `${p.logoColor}10`
                                : undefined,
                              borderColor: p.logoColor
                                ? `${p.logoColor}20`
                                : undefined,
                            }}
                          >
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={p.name}
                                className="w-14 h-14 object-contain"
                              />
                            ) : (
                              <span
                                className="text-2xl font-black font-poppins"
                                style={{ color: p.logoColor }}
                              >
                                {p.name}
                              </span>
                            )}
                          </div>
                          <span
                            className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: p.logoColor
                                ? `${p.logoColor}10`
                                : undefined,
                              color: p.logoColor,
                            }}
                          >
                            Depuis {p.since}
                          </span>
                        </div>
                        <p
                          className="font-poppins font-black text-2xl mb-1"
                          style={{ color: p.logoColor }}
                        >
                          {p.name}
                        </p>
                        <p className="text-gray-700 font-semibold text-sm leading-snug mb-2">
                          {p.fullName}
                        </p>
                        <span
                          className="inline-block text-xs font-medium px-2.5 py-1 rounded-lg mb-4 w-fit"
                          style={{
                            backgroundColor: p.logoColor
                              ? `${p.logoColor}10`
                              : undefined,
                            color: p.logoColor,
                          }}
                        >
                          {p.category}
                        </span>
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">
                          {p.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-5">
                          {(p.domains || []).map((d) => (
                            <span
                              key={d}
                              className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500 border border-gray-100"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-medium">
                            {p.partnership}
                          </span>
                          <span
                            className="text-xs font-semibold"
                            style={{ color: p.logoColor }}
                          >
                            Voir plus →
                          </span>
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {!loading &&
          partners.map((partner, i) => (
            <PartnerFullCard key={partner._id} partner={partner} index={i} />
          ))}

        <section className="py-24 bg-gradient-to-br from-green-900 to-green-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-white/10 text-green-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
                Rejoindre notre réseau
              </span>
              <h2 className="font-poppins font-bold text-4xl text-white mb-6">
                Devenez partenaire de l'ONG C.E.G
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Vous êtes une organisation internationale, un bailleur de fonds
                ou une institution souhaitant soutenir les actions
                environnementales en Guinée ? Contactez-nous.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-200 hover:scale-105 shadow-xl"
              >
                Nous proposer un partenariat
              </a>
            </motion.div>
          </div>
        </section>
      </MainLayout>
    </>
  );
}

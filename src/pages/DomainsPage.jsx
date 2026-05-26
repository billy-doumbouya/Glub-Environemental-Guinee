import { motion } from "framer-motion";
import { Leaf, Users, Heart, BookOpen, CheckCircle } from "lucide-react";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { SectionTitle } from "../components/common/SectionTitle";
import { domains } from "../data/domains";
import {
  staggerContainer,
  fadeUp,
  fadeLeft,
  fadeRight,
  viewportConfig,
} from "../animations/variants";

const iconMap = { leaf: Leaf, users: Users, heart: Heart, book: BookOpen };

function DomainDetail({ domain, index }) {
  const Icon = iconMap[domain.icon] || Leaf;
  const isEven = index % 2 === 0;

  return (
    <section
      id={domain.slug}
      className={`py-20 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid lg:grid-cols-2 gap-16 items-center ${isEven ? "" : "lg:grid-flow-col-dense"}`}
        >
          {/* Content */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className={isEven ? "" : "lg:col-start-2"}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: domain.bgColor }}
              >
                <Icon className="w-8 h-8" style={{ color: domain.color }} />
              </div>
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Domaine {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
              {domain.title}
            </h2>

            <p className="text-gray-500 leading-relaxed mb-8 text-lg">
              {domain.description}
            </p>

            <h3 className="font-semibold text-gray-900 mb-4">
              Activités principales
            </h3>
            <ul className="space-y-3 mb-8">
              {domain.activities.map((activity) => (
                <li key={activity} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: domain.color }}
                  />
                  <span className="text-gray-600 text-sm">{activity}</span>
                </li>
              ))}
            </ul>

            <div
              className="rounded-2xl p-5 border"
              style={{
                backgroundColor: domain.bgColor,
                borderColor: `${domain.color}30`,
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: domain.color }}
              >
                Impact mesuré
              </p>
              <p className="font-semibold text-gray-900">{domain.impact}</p>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className={isEven ? "" : "lg:col-start-1 lg:row-start-1"}
          >
            <div
              className="rounded-3xl h-80 flex items-center justify-center relative overflow-hidden shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${domain.color}, ${domain.color}aa)`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-10 text-9xl">
                {["🌿", "👥", "❤️", "📚"][index]}
              </div>
              <div className="relative text-center text-white p-8">
                <Icon className="w-20 h-20 mx-auto mb-4 opacity-90" />
                <p className="font-poppins font-bold text-2xl mb-2">
                  {domain.shortTitle}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {domain.activities.slice(0, 3).map((a) => (
                    <span
                      key={a}
                      className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30"
                    >
                      {a}
                    </span>
                  ))}
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
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {domains.map((domain, i) => {
                const Icon = iconMap[domain.icon] || Leaf;
                return (
                  <motion.a
                    key={domain.id}
                    href={`#${domain.slug}`}
                    variants={fadeUp}
                    className="group rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg text-center"
                    style={{
                      backgroundColor: domain.bgColor,
                      borderColor: `${domain.color}20`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${domain.color}20` }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: domain.color }}
                      />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm leading-tight">
                      {domain.shortTitle}
                    </p>
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </section>

        {domains.map((domain, i) => (
          <DomainDetail key={domain.id} domain={domain} index={i} />
        ))}
      </MainLayout>
    </>
  );
}

import { motion } from 'framer-motion'
import { ExternalLink, Globe, Users, Target } from 'lucide-react'
import { SEO } from '../seo/SEO'
import { MainLayout } from '../layouts/MainLayout'
import { PageHero } from '../components/common/PageHero'
import { SectionTitle } from '../components/common/SectionTitle'
import { partners } from '../data/partners'
import { staggerContainer, fadeUp, fadeLeft, fadeRight, viewportConfig } from '../animations/variants'

function PartnerFullCard({ partner, index }) {
  const isEven = index % 2 === 0
  return (
    <div id={partner.slug} className={`py-20 ${isEven ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className={!isEven ? 'lg:col-start-2' : ''}
          >
            <div className="flex items-center gap-5 mb-8">
              <div
                className="h-20 w-40 rounded-2xl flex items-center justify-center text-4xl font-black font-poppins shadow-lg"
                style={{ backgroundColor: `${partner.logoColor}15`, color: partner.logoColor }}
              >
                {partner.logoText}
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{partner.category}</span>
                <h2 className="font-poppins font-bold text-2xl text-gray-900">{partner.name}</h2>
                <p className="text-gray-500 text-sm">{partner.fullName}</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">{partner.description}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Type de partenariat</p>
                  <p className="font-semibold text-gray-800 text-sm">{partner.partnership}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <Target className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Partenaire depuis</p>
                  <p className="font-semibold text-gray-800 text-sm">{partner.since}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {partner.domains.map((d) => (
                <span
                  key={d}
                  className="text-sm px-4 py-1.5 rounded-full font-medium"
                  style={{ backgroundColor: `${partner.logoColor}12`, color: partner.logoColor }}
                >
                  {d}
                </span>
              ))}
            </div>

            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ backgroundColor: partner.logoColor }}
            >
              <Globe className="w-4 h-4" />
              Visiter le site officiel
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}
          >
            <div
              className="rounded-3xl p-12 flex flex-col items-center justify-center h-80 shadow-2xl relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${partner.logoColor}ee, ${partner.logoColor}88)` }}
            >
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <p className="font-black text-8xl text-white/20 font-poppins absolute">{partner.logoText}</p>
              <div className="relative text-center text-white">
                <p className="font-poppins font-black text-5xl mb-3">{partner.logoText}</p>
                <p className="text-white/80 text-sm font-medium">{partner.fullName}</p>
                <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
                  <p className="font-bold text-lg">Depuis {partner.since}</p>
                  <p className="text-white/70 text-xs">Partenariat actif</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function PartnersPage() {
  return (
    <>
      <SEO
        title="Partenaires"
        description="Les partenaires institutionnels de C.E.G : GEF, PNUE, SGP/FEM. Découvrez nos collaborations internationales pour la protection de l'environnement en Guinée."
        keywords="partenaires CEG Guinée, GEF Guinée, PNUE Guinée, SGP FEM Guinée, partenariat ONG environnement"
      />
      <MainLayout>
        <PageHero
          badge="Partenaires de confiance"
          title="Nos Partenaires"
          subtitle="C.E.G collabore avec des organisations internationales reconnues qui garantissent la qualité, la transparence et l'impact de nos interventions."
          breadcrumb={['Accueil', 'Partenaires']}
        />

        {/* Overview cards */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
              {partners.map((p) => (
                <motion.a
                  key={p.id}
                  href={`#${p.slug}`}
                  variants={fadeUp}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-transparent transition-all duration-300 text-center"
                >
                  <div
                    className="h-16 w-32 rounded-xl flex items-center justify-center text-2xl font-black font-poppins mx-auto mb-4 shadow-inner"
                    style={{ backgroundColor: `${p.logoColor}15`, color: p.logoColor }}
                  >
                    {p.logoText}
                  </div>
                  <p className="font-bold text-gray-900">{p.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{p.category}</p>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {partners.map((partner, i) => (
          <PartnerFullCard key={partner.id} partner={partner} index={i} />
        ))}

        {/* Become partner CTA */}
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
                Devenez partenaire de C.E.G
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Vous êtes une organisation internationale, un bailleur de fonds ou une institution souhaitant soutenir les actions environnementales en Guinée ? Contactez-nous.
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
  )
}

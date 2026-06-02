// src/pages/DonatePage.jsx
// Fix "page jamais naviguée" : le modal s'ouvre automatiquement si ?open=1
// + Layout sticky pour que le formulaire soit visible immédiatement sans scroll

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Shield, Lock, Star, CheckCircle } from "lucide-react";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { DonationModal } from "../components/donation/DonationModal";
import {
  DONATION_IMPACTS,
  DONOR_TESTIMONIALS,
  DONATION_TIERS,
} from "../data/donationData";
import {
  staggerContainer,
  fadeUp,
  fadeLeft,
  fadeRight,
  scaleIn,
  viewportConfig,
} from "../animations/variants";

function ImpactCard({ item }) {
  return (
    <motion.div
      variants={scaleIn}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center"
    >
      <span className="text-4xl block mb-3">{item.icon}</span>
      <p className="font-poppins font-black text-3xl text-white mb-1">
        {item.value}
      </p>
      <p className="text-green-200 text-sm">{item.label}</p>
    </motion.div>
  );
}

function TierCard({ tier, onDonate }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-green-300 hover:shadow-lg transition-all duration-300 relative cursor-pointer group"
      onClick={onDonate}
    >
      {tier.popular && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
          Le plus populaire
        </span>
      )}
      <span className="text-3xl block mb-3">{tier.emoji}</span>
      <p className="font-poppins font-bold text-xl text-gray-900 mb-0.5">
        {tier.label}
      </p>
      <p className="text-green-600 font-semibold text-sm mb-3">{tier.title}</p>
      <p className="text-gray-500 text-xs leading-relaxed mb-4">
        {tier.impact}
      </p>
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 group-hover:gap-2 transition-all">
        Donner ce montant →
      </span>
    </motion.div>
  );
}

export default function DonatePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchParams] = useSearchParams();

  // Ouvrir automatiquement le modal si ?open=1
  // Utile pour le bouton flottant qui navigue vers /don?open=1
  useEffect(() => {
    if (searchParams.get("open") === "1") {
      setTimeout(() => setModalOpen(true), 400);
    }
  }, [searchParams]);

  return (
    <>
      <SEO
        title="Faire un don"
        description="Soutenez l'ONG C.E.G et contribuez à la préservation de l'environnement guinéen. Don sécurisé par Mobile Money via GuineaPay."
        keywords="don ONG Guinée, soutenir environnement Guinée, donation CEG, Mobile Money don Guinée"
      />
      <MainLayout>
        <PageHero
          badge="Chaque don compte"
          title="Soutenez C.E.G"
          bgImage="https://media.istockphoto.com/id/2220525007/photo/online-donation-support.jpg?s=1024x1024&w=is&k=20&c=Ma3aXg66-p2V98LEQawPtHuKJvtbQ-nIeJVtIv8fS_8="
          subtitle="Votre générosité contribue directement à la préservation de l'environnement et à l'amélioration des conditions de vie des communautés guinéennes."
          breadcrumb={["Accueil", "Faire un don"]}
        />

        {/* Impact chiffré */}
        <section className="py-20 bg-gradient-to-br from-green-800 to-green-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 bg-white/10 text-green-200 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 mb-4">
                Impact de vos dons
              </span>
              <h2 className="font-poppins font-bold text-3xl text-white">
                Ce que nous avons accompli ensemble
              </h2>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {DONATION_IMPACTS.map((item) => (
                <ImpactCard key={item.label} item={item} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Paliers + CTA */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left */}
              <motion.div
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
              >
                <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-green-100">
                  Choisissez votre engagement
                </span>
                <h2 className="font-poppins font-bold text-3xl text-gray-900 mb-4 leading-tight">
                  Chaque franc guinéen
                  <br />
                  <span className="text-gradient">a un impact réel</span>
                </h2>
                <p className="text-gray-500 leading-relaxed mb-10">
                  Vos dons financent directement nos projets de reboisement, de
                  formation communautaire et d'amélioration des conditions de
                  vie en Guinée.
                </p>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  className="grid grid-cols-2 gap-4 mb-10"
                >
                  {DONATION_TIERS.map((tier) => (
                    <TierCard
                      key={tier.id}
                      tier={tier}
                      onDonate={() => setModalOpen(true)}
                    />
                  ))}
                </motion.div>

                <motion.button
                  onClick={() => setModalOpen(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-5 rounded-2xl font-poppins font-bold text-lg transition-all duration-200 shadow-xl shadow-rose-200 flex items-center justify-center gap-3"
                >
                  <Heart className="w-6 h-6 fill-white" />
                  Faire un don maintenant
                </motion.button>

                <div className="flex items-center justify-center gap-6 mt-5">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Shield className="w-3.5 h-3.5" />
                    Paiement sécurisé
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Lock className="w-3.5 h-3.5" />
                    Orange Money · Mobile Money
                  </div>
                </div>
              </motion.div>

              {/* Right */}
              <motion.div
                variants={fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {DONOR_TESTIMONIALS.map((t, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                    >
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className="w-4 h-4 text-amber-400 fill-amber-400"
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed italic mb-3">
                        "{t.text}"
                      </p>
                      <p className="text-gray-400 text-xs font-medium">
                        — {t.author}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-green-950 rounded-3xl p-8 text-white">
                  <p className="font-poppins font-bold text-lg mb-4">
                    Pourquoi faire confiance à l'ONG C.E.G ?
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Agrément officiel A/N°7838/MATD/CAB/SERPROMA/2018",
                      "Partenaires : GEF, PNUD-GUINEE, SGP/FEM",
                      "8+ années d'interventions documentées",
                      "12 000+ bénéficiaires directs",
                      "Transparence et redevabilité garanties",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-green-100">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-to-r from-rose-500 to-rose-700">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
            >
              <Heart className="w-10 h-10 text-white/80 mx-auto mb-4 fill-white/40" />
              <h2 className="font-poppins font-bold text-3xl text-white mb-4">
                Prêt à faire la différence ?
              </h2>
              <p className="text-rose-100 mb-8">
                Votre don, petit ou grand, protège les forêts guinéennes et
                améliore des vies réelles.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-white text-rose-600 hover:bg-rose-50 px-10 py-4 rounded-2xl font-poppins font-bold text-base transition-all duration-200 hover:scale-105 shadow-xl"
              >
                Je fais un don maintenant
              </button>
            </motion.div>
          </div>
        </section>

        <DonationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </MainLayout>
    </>
  );
}

// src/pages/DonationSuccessPage.jsx
// GuineaPay redirige vers /don/succes?transaction_id=XXX&amount=YYY après paiement réussi
// Ajouter dans routes/index.jsx :
//   { path: '/don/succes', element: <DonationSuccessPage /> }

import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Home, Heart, Share2 } from "lucide-react";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { staggerContainer, fadeUp } from "../animations/variants";

function formatGNF(amount) {
  if (!amount) return null;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "GNF",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export default function DonationSuccessPage() {
  const [params] = useSearchParams();

  const transactionId =
    params.get("transaction_id") || params.get("ref") || null;
  const amount = params.get("amount") || null;
  const donorName = params.get("name") || null;

  // Scroll top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shareText = `Je viens de soutenir l'ONG Club Environnemental de Guinée (C.E.G) 🌿 Rejoignez-moi pour protéger l'environnement guinéen !`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Don C.E.G",
        text: shareText,
        url: window.location.origin + "/don",
      });
    } else {
      navigator.clipboard?.writeText(shareText);
    }
  };

  return (
    <>
      <SEO
        title="Don reçu — Merci !"
        description="Votre don à l'ONG C.E.G a bien été reçu. Merci pour votre soutien à la préservation de l'environnement guinéen."
      />
      <MainLayout>
        <section className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              {/* Icône succès animée */}
              <motion.div variants={fadeUp} className="mb-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  {/* Rings animés */}
                  {[1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-green-400"
                      animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.6, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Titre */}
              <motion.h1
                variants={fadeUp}
                className="font-poppins font-black text-4xl text-gray-900 mb-3"
              >
                {donorName
                  ? `Merci, ${donorName.split(" ")[0]} !`
                  : "Merci pour votre don !"}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-green-600 font-semibold text-lg mb-6"
              >
                🌿 Votre don a bien été reçu
              </motion.p>

              {/* Montant */}
              {amount && (
                <motion.div
                  variants={fadeUp}
                  className="inline-block bg-green-600 text-white px-8 py-4 rounded-2xl mb-8 shadow-lg shadow-green-200"
                >
                  <p className="text-green-200 text-xs uppercase tracking-wider mb-1">
                    Montant du don
                  </p>
                  <p className="font-poppins font-black text-3xl">
                    {formatGNF(amount)}
                  </p>
                </motion.div>
              )}

              {/* Message impact */}
              <motion.div
                variants={fadeUp}
                className="bg-white rounded-3xl p-8 shadow-sm border border-green-100 mb-8 text-left"
              >
                <p className="text-gray-700 leading-relaxed mb-4">
                  Votre générosité contribue directement à la préservation de
                  l'environnement guinéen. Grâce à vous, l'ONG C.E.G peut
                  continuer ses actions de reboisement, de formation
                  communautaire et d'amélioration des conditions de vie en
                  Guinée.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    "🌳 Reboisement",
                    "👩 Leadership féminin",
                    "💧 Accès à l'eau",
                    "📚 Formation",
                  ].map((item) => (
                    <span
                      key={item}
                      className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Référence transaction */}
              {transactionId && (
                <motion.div
                  variants={fadeUp}
                  className="bg-gray-50 rounded-2xl px-6 py-4 mb-8 border border-gray-100"
                >
                  <p className="text-xs text-gray-400 mb-1">
                    Référence de transaction
                  </p>
                  <p className="font-mono font-bold text-gray-700">
                    {transactionId}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Conservez cette référence pour vos archives
                  </p>
                </motion.div>
              )}

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Home className="w-5 h-5" />
                  Retour à l'accueil
                </Link>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 bg-white hover:bg-green-50 text-green-700 px-8 py-4 rounded-2xl font-semibold border-2 border-green-200 hover:border-green-400 transition-all duration-200"
                >
                  <Share2 className="w-5 h-5" />
                  Partager
                </button>
              </motion.div>

              {/* Relancer don */}
              <motion.div variants={fadeUp} className="mt-8">
                <Link
                  to="/don"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-semibold"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  Faire un nouveau don
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </MainLayout>
    </>
  );
}

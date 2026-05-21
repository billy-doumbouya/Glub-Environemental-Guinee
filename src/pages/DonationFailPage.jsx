// src/pages/DonationFailPage.jsx
// GuineaPay redirige vers /don/echec?reason=XXX après paiement échoué/annulé
// Ajouter dans routes/index.jsx :
//   { path: '/don/echec', element: <DonationFailPage /> }

import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle, RotateCcw, Home, Phone, Mail } from 'lucide-react'
import { SEO } from '../seo/SEO'
import { MainLayout } from '../layouts/MainLayout'
import { staggerContainer, fadeUp } from '../animations/variants'
import { organization } from '../data/organization'

const FAILURE_REASONS = {
  cancelled:        'Le paiement a été annulé.',
  insufficient:     'Solde insuffisant sur votre compte Mobile Money.',
  timeout:          'Le délai de confirmation a expiré.',
  invalid_number:   'Numéro de téléphone invalide ou non enregistré.',
  network:          'Erreur réseau lors du traitement.',
  declined:         'Paiement refusé par l\'opérateur.',
}

export default function DonationFailPage() {
  const [params] = useSearchParams()

  const reason        = params.get('reason') || null
  const transactionId = params.get('transaction_id') || params.get('ref') || null

  const errorMessage = FAILURE_REASONS[reason] || 'Une erreur est survenue lors du traitement de votre paiement.'

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <SEO
        title="Paiement échoué"
        description="Le paiement n'a pas pu être traité. Vous pouvez réessayer votre don à l'ONG C.E.G."
      />
      <MainLayout>
        <section className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              {/* Icône échec */}
              <motion.div variants={fadeUp} className="mb-8">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-poppins font-black text-4xl text-gray-900 mb-3">
                Paiement non abouti
              </motion.h1>

              <motion.p variants={fadeUp} className="text-red-500 font-medium text-lg mb-8">
                {errorMessage}
              </motion.p>

              {/* Explication */}
              <motion.div
                variants={fadeUp}
                className="bg-white rounded-3xl p-8 shadow-sm border border-red-100 mb-8 text-left"
              >
                <p className="font-semibold text-gray-900 mb-4">Que s'est-il passé ?</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  {[
                    'Votre solde Mobile Money était insuffisant',
                    'Vous n\'avez pas confirmé la demande sur votre téléphone dans le délai imparti',
                    'Le réseau de votre opérateur a rencontré une interruption',
                    'Vous avez annulé la transaction',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Transaction ref si dispo */}
              {transactionId && (
                <motion.div
                  variants={fadeUp}
                  className="bg-gray-50 rounded-2xl px-6 py-4 mb-8 border border-gray-100"
                >
                  <p className="text-xs text-gray-400 mb-1">Référence de la tentative</p>
                  <p className="font-mono font-bold text-gray-700">{transactionId}</p>
                </motion.div>
              )}

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Link
                  to="/don"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                  Réessayer le don
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  <Home className="w-5 h-5" />
                  Retour à l'accueil
                </Link>
              </motion.div>

              {/* Contact support */}
              <motion.div
                variants={fadeUp}
                className="bg-green-50 rounded-2xl p-6 border border-green-100"
              >
                <p className="text-gray-700 text-sm font-semibold mb-4">
                  Le problème persiste ? Contactez-nous directement :
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`tel:${organization.phones[0]}`}
                    className="inline-flex items-center gap-2 bg-white text-green-700 px-5 py-2.5 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {organization.phones[0]}
                  </a>
                  <a
                    href={`mailto:${organization.email}`}
                    className="inline-flex items-center gap-2 bg-white text-green-700 px-5 py-2.5 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>
      </MainLayout>
    </>
  )
}

// src/components/donation/DonationStatus.jsx
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, Smartphone, XCircle, RotateCcw } from 'lucide-react'

export function DonationSuccess({ donorName, transactionId, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="py-10 text-center"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-2">
        Merci, {donorName?.split(' ')[0]} ! 🌿
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-4">
        Votre don a été reçu avec succès. Il contribuera directement à la préservation
        de l'environnement guinéen.
      </p>

      {transactionId && (
        <div className="bg-gray-50 rounded-xl px-5 py-3 inline-block mb-6 border border-gray-100">
          <p className="text-xs text-gray-400">Référence de transaction</p>
          <p className="font-mono font-bold text-gray-700 text-sm">{transactionId}</p>
        </div>
      )}

      <p className="text-xs text-gray-400 mb-8">
        Un email de confirmation vous a été envoyé.
      </p>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Faire un autre don
      </button>
    </motion.div>
  )
}

export function DonationAwaiting() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-10 text-center"
    >
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
          <Smartphone className="w-9 h-9 text-amber-500" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 border-4 border-amber-300 rounded-full"
        />
      </div>

      <h3 className="font-poppins font-bold text-xl text-gray-900 mb-3">
        Confirmez sur votre téléphone
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
        Vous allez recevoir une demande de confirmation sur votre Mobile Money.
        Veuillez valider le paiement sur votre téléphone.
      </p>

      <div className="mt-6 flex items-center justify-center gap-2 text-amber-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">En attente de confirmation…</span>
      </div>
    </motion.div>
  )
}

export function DonationError({ message, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8 text-center"
    >
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <XCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="font-poppins font-bold text-xl text-gray-900 mb-2">
        Échec du paiement
      </h3>
      <p className="text-gray-500 text-sm mb-2">{message}</p>
      <p className="text-gray-400 text-xs mb-6">
        Contactez-nous : clubenvironnementaldeguinee@gmail.com
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Réessayer
      </button>
    </motion.div>
  )
}

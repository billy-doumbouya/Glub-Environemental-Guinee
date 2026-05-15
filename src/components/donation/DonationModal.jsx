// src/components/donation/DonationModal.jsx
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Leaf, Lock, Shield } from 'lucide-react'
import { useDonation } from '../../hooks/useDonation'
import { DonationTiers } from './DonationTiers'
import { DonationForm } from './DonationForm'
import { DonationSuccess, DonationAwaiting, DonationError } from './DonationStatus'
import { DONATION_TIERS } from '../../data/donationData'

function getSummaryAmount(selectedTier, isCustom, watchCustom) {
  if (isCustom && watchCustom) return `${Number(watchCustom).toLocaleString('fr-FR')} GNF`
  const tier = DONATION_TIERS.find((t) => t.id === selectedTier)
  return tier ? tier.label : null
}

export function DonationModal({ isOpen, onClose }) {
  const {
    form,
    selectedTier,
    isCustom,
    status,
    transactionId,
    errorMessage,
    selectTier,
    enableCustom,
    onSubmit,
    reset,
  } = useDonation({ onSuccess: () => {} })

  const { register, formState: { errors }, watch } = form
  const watchCustom = watch('customAmount')
  const summaryAmount = getSummaryAmount(selectedTier, isCustom, watchCustom)

  // Bloquer le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Fermer avec Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleClose = () => {
    if (status === 'awaiting_payment') return // Empêcher fermeture pendant paiement en cours
    reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="pointer-events-auto bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-green-700 to-green-900 px-6 py-5 rounded-t-3xl flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-white">Faire un don à C.E.G</p>
                    <p className="text-green-200 text-xs">Paiement sécurisé · Mobile Money</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={status === 'awaiting_payment'}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                {/* États spéciaux */}
                {status === 'success' && (
                  <DonationSuccess
                    donorName={form.getValues('donorName')}
                    transactionId={transactionId}
                    onReset={() => { reset(); onClose() }}
                  />
                )}
                {status === 'awaiting_payment' && <DonationAwaiting />}
                {status === 'error' && (
                  <DonationError message={errorMessage} onReset={reset} />
                )}

                {/* Formulaire principal */}
                {(status === 'idle' || status === 'loading') && (
                  <form
                    onSubmit={(e) => { e.preventDefault(); onSubmit(DONATION_TIERS) }}
                    noValidate
                    className="space-y-6"
                  >
                    <DonationTiers
                      selectedTier={selectedTier}
                      isCustom={isCustom}
                      onSelectTier={selectTier}
                      onCustom={enableCustom}
                      customAmountError={errors.customAmount?.message}
                      register={register}
                    />

                    <div className="border-t border-gray-100" />

                    <DonationForm register={register} errors={errors} />

                    {/* Erreur globale */}
                    {errorMessage && status !== 'error' && (
                      <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                        {errorMessage}
                      </p>
                    )}

                    {/* Résumé + Submit */}
                    <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600 font-medium">Montant du don</span>
                        <span className="font-poppins font-bold text-green-700 text-lg">
                          {summaryAmount || <span className="text-gray-300 text-sm">Non sélectionné</span>}
                        </span>
                      </div>
                      <button
                        type="submit"
                        disabled={status === 'loading' || !summaryAmount}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-200"
                      >
                        {status === 'loading' ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Traitement en cours…
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4" />
                            Confirmer le don
                            {summaryAmount && ` · ${summaryAmount}`}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Sécurité */}
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                      <Lock className="w-3 h-3" />
                      <span>Paiement sécurisé via LengoPay · Orange Money & Mobile Money</span>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

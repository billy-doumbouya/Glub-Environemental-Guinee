// src/components/donation/DonationTiers.jsx
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { DONATION_TIERS } from '../../data/donationData'
import { staggerContainer, scaleIn } from '../../animations/variants'

export function DonationTiers({ selectedTier, isCustom, onSelectTier, onCustom, customAmountError, register }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-gray-700">
        Choisissez un montant <span className="text-red-500">*</span>
      </p>

      {/* Paliers */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3"
      >
        {DONATION_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id && !isCustom
          return (
            <motion.button
              key={tier.id}
              type="button"
              variants={scaleIn}
              onClick={() => onSelectTier(tier)}
              className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-200 cursor-pointer group ${
                isSelected ? tier.selected : `bg-white ${tier.color}`
              }`}
            >
              {/* Badge populaire */}
              {tier.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Populaire
                </span>
              )}

              {/* Check icon */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              <span className="text-2xl mb-1 block">{tier.emoji}</span>
              <p className="font-poppins font-bold text-base text-gray-900">{tier.label}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{tier.title}</p>
              <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">{tier.impact}</p>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Montant libre */}
      <div>
        <button
          type="button"
          onClick={onCustom}
          className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 text-left flex items-center justify-between ${
            isCustom
              ? 'border-gray-700 bg-gray-50 ring-2 ring-gray-300'
              : 'border-dashed border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 bg-white'
          }`}
        >
          <span>{isCustom ? 'Montant personnalisé' : '✏️  Autre montant'}</span>
          {isCustom && <Check className="w-4 h-4 text-gray-700" />}
        </button>

        {isCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2"
          >
            <div className="relative">
              <input
                {...register('customAmount', { valueAsNumber: true })}
                type="number"
                placeholder="Ex: 75 000"
                min={10000}
                className={`w-full px-4 py-3 pr-16 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${
                  customAmountError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                GNF
              </span>
            </div>
            {customAmountError && (
              <p className="text-red-500 text-xs mt-1">{customAmountError}</p>
            )}
            <p className="text-[10px] text-gray-400 mt-1">Minimum : 10 000 GNF</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

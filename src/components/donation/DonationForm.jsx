// src/components/donation/DonationForm.jsx
import { User, Mail, Phone, XCircle } from 'lucide-react'

function Field({ label, error, icon: Icon, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        {children}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <XCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  )
}

const inputClass = (hasIcon, hasError) =>
  `w-full py-3 pr-4 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-green-500/20 ${
    hasIcon ? 'pl-10' : 'pl-4'
  } ${
    hasError
      ? 'border-red-300 bg-red-50 focus:border-red-400'
      : 'border-gray-200 bg-white focus:border-green-500'
  }`

export function DonationForm({ register, errors }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-gray-700">Vos coordonnées</p>

      <Field label="Nom complet" error={errors.donorName?.message} icon={User} required>
        <input
          {...register('donorName')}
          type="text"
          placeholder="Votre nom et prénom"
          className={inputClass(true, !!errors.donorName)}
        />
      </Field>

      <Field label="Adresse email" error={errors.donorEmail?.message} icon={Mail} required>
        <input
          {...register('donorEmail')}
          type="email"
          placeholder="votre@email.com"
          className={inputClass(true, !!errors.donorEmail)}
        />
      </Field>

      <Field
        label="Numéro Mobile Money"
        error={errors.phone?.message}
        icon={Phone}
        required
      >
        <input
          {...register('phone')}
          type="tel"
          placeholder="Ex: 612 41 34 24"
          className={inputClass(true, !!errors.phone)}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          Orange Money ou MTN Mobile Money — numéro guinéen
        </p>
      </Field>
    </div>
  )
}

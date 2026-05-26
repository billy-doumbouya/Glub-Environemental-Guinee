import { CheckCircle, XCircle, Loader2, Send } from "lucide-react";
import { useContactForm } from "../../hooks/useContactForm";
import { CONTACT_SUBJECTS } from "../../constants";

function FormField({ label, error, children, required }) {
  return (
    <div className="group">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {label}
        {required && <span className="text-green-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
          <XCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full px-4 py-3.5 rounded-xl border-0 border-b-2 bg-gray-50 text-sm text-gray-800
   placeholder:text-gray-300 transition-all duration-200 outline-none
   focus:bg-white focus:shadow-sm
   ${
     hasError
       ? "border-red-300 focus:border-red-400"
       : "border-gray-200 focus:border-green-500"
   }`;

export function ContactForm() {
  const { form, status, onSubmit, resetStatus } = useContactForm();
  const {
    register,
    formState: { errors },
  } = form;

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-8">
        {/* Animated checkmark ring */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-ping opacity-30" />
        </div>

        <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-3">
          Message envoyé !
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
          Merci pour votre message. L'équipe ONG C.E.G vous contactera dans les
          meilleurs délais.
        </p>
        <button
          onClick={resetStatus}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700
                     text-white px-7 py-3 rounded-xl font-semibold text-sm
                     transition-all duration-200 hover:shadow-lg hover:shadow-green-100"
        >
          <Send className="w-4 h-4" />
          Nouveau message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Nom complet" error={errors.name?.message} required>
          <input
            {...register("name")}
            type="text"
            placeholder="Votre nom"
            className={inputClass(!!errors.name)}
          />
        </FormField>

        <FormField label="Adresse email" error={errors.email?.message} required>
          <input
            {...register("email")}
            type="email"
            placeholder="votre@email.com"
            className={inputClass(!!errors.email)}
          />
        </FormField>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Téléphone" error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="tel"
            placeholder="(+224) xxx xxx xxx"
            className={inputClass(!!errors.phone)}
          />
        </FormField>

        <FormField label="Sujet" error={errors.subject?.message} required>
          <select
            {...register("subject")}
            className={inputClass(!!errors.subject)}
          >
            <option value="">Sélectionner un sujet</option>
            {CONTACT_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Message */}
      <FormField label="Message" error={errors.message?.message} required>
        <textarea
          {...register("message")}
          rows={5}
          placeholder="Décrivez votre demande en détail..."
          className={`${inputClass(!!errors.message)} resize-none`}
        />
      </FormField>

      {/* Error states */}
      {status === "error" && (
        <div className="flex items-start gap-3 text-red-500 bg-red-50 rounded-2xl px-5 py-4 border border-red-100">
          <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="text-sm leading-relaxed">
            Une erreur est survenue. Veuillez réessayer ou nous contacter
            directement par email.
          </p>
        </div>
      )}

      {status === "spam" && (
        <div className="flex items-start gap-3 text-amber-600 bg-amber-50 rounded-2xl px-5 py-4 border border-amber-100">
          <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="text-sm leading-relaxed">
            Trop de messages envoyés. Veuillez patienter quelques minutes.
          </p>
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full relative overflow-hidden
                     bg-green-600 hover:bg-green-700
                     disabled:opacity-60 disabled:cursor-not-allowed
                     text-white py-4 rounded-2xl font-semibold text-sm
                     transition-all duration-300
                     flex items-center justify-center gap-2
                     hover:shadow-xl hover:shadow-green-600/20
                     hover:-translate-y-0.5"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Envoyer le message
            </>
          )}
        </button>

        <p className="text-xs text-gray-300 text-center mt-4">
          Vos données sont utilisées uniquement pour répondre à votre demande.
        </p>
      </div>
    </form>
  );
}

import { CheckCircle, XCircle, Loader2, Send } from "lucide-react";
import { useContactForm } from "../../hooks/useContactForm";
import { CONTACT_SUBJECTS } from "../../constants";

function FormField({ label, error, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500/20 ${
    hasError
      ? "border-red-300 bg-red-50 focus:border-red-400"
      : "border-gray-200 bg-white focus:border-green-500"
  }`;

export function ContactForm() {
  const { form, status, onSubmit, resetStatus } = useContactForm();
  const {
    register,
    formState: { errors, isValid },
  } = form;

  if (status === "success") {
    return (
      <div className="bg-green-50 rounded-3xl p-12 text-center border border-green-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-3">
          Message envoyé avec succès !
        </h3>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Merci pour votre message. L'équipe ONG C.E.G vous contactera dans les
          meilleurs délais.
        </p>
        <button
          onClick={resetStatus}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Téléphone" error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="tel"
            placeholder="(+224) xxx xxx xxx (optionnel)"
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

      <FormField label="Message" error={errors.message?.message} required>
        <textarea
          {...register("message")}
          rows={6}
          placeholder="Décrivez votre demande en détail..."
          className={`${inputClass(!!errors.message)} resize-none`}
        />
      </FormField>

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
          <XCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm">
            Une erreur est survenue. Veuillez réessayer ou nous contacter par
            email.
          </p>
        </div>
      )}

      {status === "spam" && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
          <XCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm">
            Trop de messages envoyés. Veuillez patienter quelques minutes.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-200"
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

      <p className="text-xs text-gray-400 text-center">
        En soumettant ce formulaire, vous acceptez que vos données soient
        utilisées pour répondre à votre demande.
      </p>
    </form>
  );
}

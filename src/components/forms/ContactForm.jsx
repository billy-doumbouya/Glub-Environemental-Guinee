import {
  CheckCircle,
  XCircle,
  Loader2,
  Send,
  AlertTriangle,
} from "lucide-react";
import { Controller } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useContactForm } from "../../hooks/useContactForm";
import { CONTACT_SUBJECTS } from "../../constants";

// ─── Shared input style factory ───────────────────────────────────────────────
const inputBase = `
  w-full px-4 py-3.5 rounded-xl text-sm text-gray-800
  bg-white border transition-all duration-200 outline-none
  placeholder:text-gray-300
`;

const inputClass = (hasError) =>
  `${inputBase} ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
  }`;

// ─── FormField ────────────────────────────────────────────────────────────────
function FormField({ label, error, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        {label}
        {required && (
          <span className="text-green-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium mt-0.5">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {/* Animated rings */}
      <div className="relative mb-7">
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: "rgba(22,163,74,0.4)" }}
        />
        <div
          className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(22,163,74,0.10)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "rgba(22,163,74,0.16)" }}
          >
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
        </div>
      </div>

      <h3 className="font-poppins font-bold text-xl text-gray-900 mb-2">
        Message envoyé !
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-[260px]">
        L'équipe C.E.G vous contactera sous{" "}
        <span className="font-semibold text-gray-600">
          48 heures ouvrables.
        </span>
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700
                   text-white px-6 py-3 rounded-xl text-sm font-semibold
                   transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-200"
      >
        <Send className="w-4 h-4" />
        Nouveau message
      </button>
    </div>
  );
}

// ─── Alert banner ─────────────────────────────────────────────────────────────
function Alert({ type, message }) {
  const styles = {
    error: {
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-600",
      Icon: XCircle,
    },
    spam: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-700",
      Icon: AlertTriangle,
    },
  };
  const { bg, border, text, Icon } = styles[type];
  return (
    <div
      className={`flex items-start gap-3 ${bg} border ${border} rounded-xl px-4 py-3.5`}
    >
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${text}`} />
      <p className={`text-sm leading-relaxed ${text}`}>{message}</p>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export function ContactForm() {
  const { form, status, onSubmit, resetStatus } = useContactForm();
  const {
    register,
    control,
    formState: { errors },
  } = form;

  if (status === "success") return <SuccessState onReset={resetStatus} />;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Row 1 — Nom + Email */}
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

      {/* Row 2 — Téléphone + Sujet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Téléphone" error={errors.phone?.message} required>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                defaultCountry="gn"
                value={field.value}
                onChange={field.onChange}
                inputClassName={inputClass(!!errors.phone)}
                className={`phone-input-wrapper ${
                  errors.phone ? "phone-input-error" : ""
                }`}
              />
            )}
          />
        </FormField>

        <FormField label="Sujet" error={errors.subject?.message} required>
          <select
            {...register("subject")}
            className={`${inputClass(!!errors.subject)} cursor-pointer appearance-none`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              paddingRight: "40px",
            }}
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

      {/* Error banners */}
      {status === "error" && (
        <Alert
          type="error"
          message="Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email."
        />
      )}
      {status === "spam" && (
        <Alert
          type="spam"
          message="Trop de messages envoyés. Veuillez patienter quelques minutes."
        />
      )}

      {/* Submit */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 rounded-2xl text-sm font-bold text-white
                     transition-all duration-200
                     disabled:opacity-60 disabled:cursor-not-allowed
                     hover:-translate-y-0.5"
          style={{
            background:
              status === "loading"
                ? "#16a34a"
                : "linear-gradient(135deg, #16a34a, #059669)",
            boxShadow:
              status === "loading"
                ? "none"
                : "0 0 0 1px rgba(22,163,74,0.3), 0 8px 24px rgba(5,150,105,0.20)",
          }}
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

        <p className="text-[11px] text-gray-300 text-center mt-4 leading-relaxed">
          Vos données sont utilisées uniquement pour répondre à votre demande.
        </p>
      </div>
    </form>
  );
}
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import emailjs from "emailjs-com";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
} from "../constants";

const schema = yup.object({
  name: yup
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .required("Le nom est requis"),
  email: yup
    .string()
    .email("Adresse email invalide")
    .required("L'email est requis"),
  // Dans useDonation.js / schéma Yup
 phone: yup
  .string()
  .nullable()
  .optional()
  .test(
    "phone-format",
    "Numéro invalide",
    (value) => {
      if (!value) return true; // champ optionnel
      // Caractères autorisés (formatage international)
      if (!/^[\d\s\+\-\(\)]+$/.test(value)) return false;
      // On compte uniquement les chiffres pour la longueur réelle
      const digitsOnly = value.replace(/\D/g, "");
      return digitsOnly.length >= 8 && digitsOnly.length <= 15;
    }
  ),
  subject: yup.string().required("Le sujet est requis"),
  message: yup
    .string()
    .min(20, "Le message doit contenir au moins 20 caractères")
    .required("Le message est requis"),
});

export function useContactForm() {
  const [status, setStatus] = useState("idle");
  const [submitCount, setSubmitCount] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(null);

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const isSpam = () => {
    if (!lastSubmitTime) return false;
    const timeSinceLastSubmit = Date.now() - lastSubmitTime;
    return timeSinceLastSubmit < 60000 && submitCount >= 3;
  };

  const onSubmit = async (data) => {
    if (isSpam()) {
      setStatus("spam");
      return;
    }

    setStatus("loading");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          phone: data.phone || "Non renseigné",
          subject: data.subject,
          message: data.message,
          to_name: "C.E.G",
          reply_to: data.email,
        },
        EMAILJS_PUBLIC_KEY,
      );

      setStatus("success");
      setSubmitCount((prev) => prev + 1);
      setLastSubmitTime(Date.now());
      form.reset();
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("error");
    }
  };

  const resetStatus = () => setStatus("idle");

  return { form, status, onSubmit: form.handleSubmit(onSubmit), resetStatus };
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import emailjs from "emailjs-com";
import { isValidPhoneNumber } from "libphonenumber-js";
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
  // react-international-phone renvoie toujours la valeur au format
  // international complet (ex: "+224622000000"), avec indicatif inclus.
  // isValidPhoneNumber valide la longueur/le format réel attendu pour
  // le pays détecté à partir de l'indicatif, pas juste un comptage brut.
  phone: yup
    .string()
    .required("Le numéro de téléphone est requis")
    .test(
      "phone-valid",
      "Numéro de téléphone invalide",
      (value) => !!value && isValidPhoneNumber(value),
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
    defaultValues: {
      name: "",
      email: "",
      // Indicatif guinéen pré-rempli ; cohérent avec defaultCountry="gn"
      // passé au composant PhoneInput côté UI.
      phone: "+224",
      subject: "",
      message: "",
    },
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
          phone: data.phone,
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
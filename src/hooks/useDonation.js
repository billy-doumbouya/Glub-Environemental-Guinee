// src/hooks/useDonation.js
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { sendDonationReceipt } from "../services/donationReceiptService";
import { MIN_AMOUNT, MAX_AMOUNT } from "../data/donationData";
import {
  generateTransactionId,
  initiatePayment,
} from "../services/geniusPayService"; // ← nom mis à jour
import api from "../../api/axios";

const schema = yup.object({
  donorName: yup
    .string()
    .min(2, "Nom trop court")
    .required("Le nom est requis"),
  donorEmail: yup
    .string()
    .email("Email invalide")
    .required("L'email est requis"),
  phone: yup
    .string()
    .matches(/^[\d\s\+\-\(\)]{8,15}$/, "Numéro invalide (ex: 612 41 34 24)")
    .required("Le numéro Mobile Money est requis"),
  customAmount: yup
    .number()
    .nullable()
    .transform((v) => (isNaN(v) ? null : v))
    .when("$isCustom", {
      is: true,
      then: (s) =>
        s
          .min(MIN_AMOUNT, `Minimum ${MIN_AMOUNT.toLocaleString("fr-FR")} GNF`)
          .max(MAX_AMOUNT, `Maximum ${MAX_AMOUNT.toLocaleString("fr-FR")} GNF`)
          .required("Veuillez saisir un montant"),
    }),
});

export function useDonation({ onSuccess } = {}) {
  const [selectedTier, setSelectedTier] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [status, setStatus] = useState("idle");
  const [transactionId, setTransactionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    resolver: yupResolver(schema),
    context: { isCustom },
    mode: "onChange",
  });

  const selectTier = useCallback(
    (tier) => {
      setSelectedTier(tier.id);
      setIsCustom(false);
      form.clearErrors("customAmount");
    },
    [form],
  );

  const enableCustom = useCallback(() => {
    setSelectedTier(null);
    setIsCustom(true);
  }, []);

  const resolveAmount = useCallback(
    (tiers, customAmountValue) => {
      if (isCustom) return Number(customAmountValue);
      const tier = tiers.find((t) => t.id === selectedTier);
      return tier?.amount || 0;
    },
    [isCustom, selectedTier],
  );

  const onSubmit = useCallback(
    (tiers) =>
      form.handleSubmit(async (data) => {
        const amount = resolveAmount(tiers, data.customAmount);

        if (!amount || amount < MIN_AMOUNT) {
          setErrorMessage(
            `Veuillez choisir un montant (minimum ${MIN_AMOUNT.toLocaleString("fr-FR")} GNF)`,
          );
          return;
        }

        setStatus("loading");
        setErrorMessage("");

        const txId = generateTransactionId();
        setTransactionId(txId);

        try {
          const result = await initiatePayment({
            amount,
            // phone retiré : GeniusPay le demande sur sa page checkout
            donorName: data.donorName,
            donorEmail: data.donorEmail,
            transactionId: txId,
          });

          // GeniusPay retourne toujours une checkoutUrl → redirection
          if (result.paymentUrl) {
            await api
              .post("/api/donations", {
                donorName: data.donorName,
                donorEmail: data.donorEmail,
                phone: data.phone,
                amount,
                transactionId: txId,
              })
              .catch((err) =>
                console.error(
                  "[Donation] Erreur enregistrement DB:",
                  err.message,
                ),
              );

            // Envoi reçu email avant de quitter la page
            await sendDonationReceipt({
              donorName: data.donorName,
              donorEmail: data.donorEmail,
              amount,
              transactionId: txId,
            }).catch(() => {}); // silencieux si email échoue

            window.location.href = result.paymentUrl;
            return;
          }

          // Fallback si pas d'URL (ne devrait pas arriver avec GeniusPay)
          setStatus("success");
          onSuccess?.({ amount, txId, donorName: data.donorName });
        } catch (err) {
          console.error("[Donation] Erreur GeniusPay:", err.message);
          setStatus("error");
          setErrorMessage(
            err.message || "Une erreur est survenue. Veuillez réessayer.",
          );
        }
      })(),
    [form, resolveAmount, onSuccess],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage("");
    setSelectedTier(null);
    setIsCustom(false);
    setTransactionId(null);
    form.reset();
  }, [form]);

  return {
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
  };
}

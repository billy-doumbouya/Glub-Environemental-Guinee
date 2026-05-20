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
} from "../services/genunePayService";

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

/**
 * Statuts possibles :
 * idle | loading | awaiting_payment | success | error
 */
export function useDonation({ onSuccess } = {}) {
  const [selectedTier, setSelectedTier] = useState(null); // id du palier choisi
  const [isCustom, setIsCustom] = useState(false); // montant libre activé
  const [status, setStatus] = useState("idle");
  const [transactionId, setTransactionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    resolver: yupResolver(schema),
    context: { isCustom },
    mode: "onChange",
  });

  /** Sélectionner un palier prédéfini */
  const selectTier = useCallback(
    (tier) => {
      setSelectedTier(tier.id);
      setIsCustom(false);
      form.clearErrors("customAmount");
    },
    [form],
  );

  /** Activer le champ montant libre */
  const enableCustom = useCallback(() => {
    setSelectedTier(null);
    setIsCustom(true);
  }, []);

  /** Résout le montant final selon le mode */
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
            phone: data.phone,
            donorName: data.donorName,
            donorEmail: data.donorEmail,
            transactionId: txId,
          });

          // Si LengoPay retourne une URL de redirection
          if (result.paymentUrl) {
            window.location.href = result.paymentUrl;
            return;
          }

          // Sinon : paiement initié → attente confirmation OTP sur le téléphone
          setStatus("awaiting_payment");

          // Envoi reçu email (silencieux si template non configuré)
          await sendDonationReceipt({
            donorName: data.donorName,
            donorEmail: data.donorEmail,
            amount,
            transactionId: txId,
          });

          // Après 3s simuler la confirmation (remplacer par webhook réel si dispo)
          setTimeout(() => {
            setStatus("success");
            form.reset();
            setSelectedTier(null);
            setIsCustom(false);
            onSuccess?.({ amount, txId, donorName: data.donorName });
          }, 3000);
        } catch (err) {
          console.error("[Donation] Erreur LengoPay:", err.message);
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

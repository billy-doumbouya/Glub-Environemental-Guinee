// src/services/donationReceiptService.js
//
// Utilise EmailJS (déjà installé) pour envoyer un email de confirmation
// au donateur — zéro serveur requis.
//
// Dans ton dashboard EmailJS :
// 1. Créer un nouveau template "donation_receipt"
// 2. Variables disponibles dans le template :
//    {{donor_name}}, {{amount_formatted}}, {{transaction_id}},
//    {{donor_email}}, {{donation_date}}, {{organization_email}}
//
// Ajouter dans .env :
//   VITE_EMAILJS_DONATION_TEMPLATE_ID=template_don_ceg

import emailjs from "emailjs-com";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_DONATION_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Formate un montant GNF en string lisible
 * ex: 50000 → "50 000 GNF"
 */
export function formatGNF(amount) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "GNF",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Envoie un email de remerciement/confirmation au donateur via EmailJS.
 * Échoue silencieusement — le don est déjà effectué, l'email est bonus.
 *
 * @param {Object} params
 * @param {string} params.donorName
 * @param {string} params.donorEmail
 * @param {number} params.amount
 * @param {string} params.transactionId
 */
export async function sendDonationReceipt({
  donorName,
  donorEmail,
  amount,
  transactionId,
}) {
  // Si le template de reçu n'est pas configuré, on échoue silencieusement
  if (!TEMPLATE_ID || !SERVICE_ID || !PUBLIC_KEY) {
    console.warn(
      "[DonationReceipt] EmailJS non configuré pour les reçus — ignoré.",
    );
    return;
  }

  const templateParams = {
    donor_name: donorName,
    donor_email: donorEmail,
    amount_formatted: formatGNF(amount),
    transaction_id: transactionId,
    donation_date: new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    organization_email: "contact@clubenvironnementaldeguinee.org",
    to_email: donorEmail,
    reply_to: "contact@clubenvironnementaldeguinee.org",
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log("[DonationReceipt] Email de confirmation envoyé à", donorEmail);
  } catch (err) {
    // Échec silencieux — le don est traité, l'email n'est qu'un bonus
    console.warn("[DonationReceipt] Échec envoi email:", err);
  }
}

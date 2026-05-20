// src/services/lengoPayService.js
//
// Variables d'environnement requises dans .env :
//   VITE_LENGOPAY_API_KEY=your_api_key
//   VITE_LENGOPAY_MERCHANT_ID=your_merchant_id
//   VITE_LENGOPAY_BASE_URL=https://api.lengopay.com   (ou l'URL fournie par LengoPay)
//
// Sur Vercel : Settings → Environment Variables → ajouter les 3 variables

const API_KEY = import.meta.env.VITE_GUINEPAY_PRIVATE_KEY;
const MERCHANT_ID = import.meta.env.VITE_LENGOPAY_MERCHANT_ID;
const BASE_URL =
  import.meta.env.VITE_LENGOPAY_BASE_URL || "https://api.lengopay.com";

/**
 * Génère un ID de transaction unique pour C.E.G
 * Format : CEG-{timestamp}-{random4}
 */
export function generateTransactionId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CEG-${ts}-${rand}`;
}

/**
 * Initie un paiement via LengoPay (Orange Money / Mobile Money Guinée)
 *
 * @param {Object} params
 * @param {number} params.amount        - Montant en GNF
 * @param {string} params.phone         - Numéro de téléphone du donateur (format: 6XXXXXXXX)
 * @param {string} params.donorName     - Nom complet du donateur
 * @param {string} params.donorEmail    - Email du donateur
 * @param {string} params.transactionId - ID unique généré par generateTransactionId()
 * @returns {Promise<{success: boolean, reference?: string, message?: string}>}
 */
export async function initiatePayment({
  amount,
  phone,
  donorName,
  donorEmail,
  transactionId,
}) {
  if (!API_KEY || !MERCHANT_ID) {
    throw new Error(
      "Clés LengoPay manquantes. Vérifier VITE_LENGOPAY_API_KEY et VITE_LENGOPAY_MERCHANT_ID dans .env",
    );
  }

  const payload = {
    merchant_id: MERCHANT_ID || "",
    transaction_id: transactionId,
    amount: amount,
    currency: "GNF",
    phone: normalizePhone(phone),
    customer: {
      name: donorName,
      email: donorEmail,
      phone: normalizePhone(phone),
    },
    description: `Don ONG C.E.G — Club Environnemental de Guinée`,
    callback_url: `${window.location.origin}/don/confirmation`,
    metadata: {
      organization: "CEG",
      type: "donation",
      donor_name: donorName,
      donor_email: donorEmail,
    },
  };

  const response = await fetch(`${BASE_URL}/v1/payments/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "X-Merchant-ID": MERCHANT_ID,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `Erreur LengoPay: ${response.status}`,
    );
  }

  return {
    success: true,
    reference: data?.reference || data?.transaction_reference || transactionId,
    paymentUrl: data?.payment_url || data?.redirect_url || null,
    data,
  };
}

/**
 * Vérifie le statut d'un paiement (optionnel — polling côté client)
 * @param {string} transactionId
 */
export async function checkPaymentStatus(transactionId) {
  const response = await fetch(
    `${BASE_URL}/v1/payments/status/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "X-Merchant-ID": MERCHANT_ID,
      },
    },
  );

  const data = await response.json();
  return data;
}

/**
 * Normalise un numéro de téléphone guinéen
 * Accepte : 612413424 / +224612413424 / 00224612413424
 * Retourne : +224612413424
 */
function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("224")) return `+${digits}`;
  if (digits.startsWith("00224")) return `+${digits.slice(2)}`;
  if (digits.length === 9) return `+224${digits}`;
  return `+224${digits}`;
}

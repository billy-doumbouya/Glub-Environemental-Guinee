// src/services/geniusPayService.js

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
 * Initie un paiement via la Vercel Function /api/create-payment
 * La fonction serveur appelle GeniusPay avec les clés secrètes.
 *
 * @param {Object} params
 * @param {number} params.amount        - Montant en XOF
 * @param {string} params.donorName     - Nom complet du donateur
 * @param {string} params.donorEmail    - Email du donateur
 * @param {string} params.transactionId - ID unique généré par generateTransactionId()
 * @returns {Promise<{success: boolean, reference: string, checkoutUrl: string}>}
 */
export async function initiatePayment({
  amount,
  donorName,
  donorEmail,
  transactionId,
}) {
  const response = await fetch("/api/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, donorName, donorEmail, transactionId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || `Erreur paiement: ${response.status}`);
  }

  return {
    success: true,
    reference: data.reference,
    paymentUrl: data.checkoutUrl, // ← même nom que ce qu'attend useDonation
  };
}

/**
 * Vérifie le statut d'un paiement via la Vercel Function /api/payment-status
 * @param {string} reference - La référence GeniusPay (ex: MTX-A1B2C3D4E5)
 */
export async function checkPaymentStatus(reference) {
  const response = await fetch(`/api/payment-status?ref=${reference}`);
  const data = await response.json();
  return data;
}

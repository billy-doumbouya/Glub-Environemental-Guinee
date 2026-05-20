// api/create-payment.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { amount, donorName, donorEmail, transactionId } = req.body;

  try {
    const response = await fetch(
      "https://pay.genius.ci/api/v1/merchant/payments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.GENIUSPAY_PUBLIC_KEY,
          "X-API-Secret": process.env.GENIUSPAY_SECRET_KEY,
        },
        body: JSON.stringify({
          amount,
          currency: "XOF",
          description: "Don ONG C.E.G",
          customer: { name: donorName, email: donorEmail },
          success_url: `${process.env.SITE_URL}/don/confirmation`,
          error_url: `${process.env.SITE_URL}/don/erreur`,
          metadata: { transaction_id: transactionId, type: "donation" },
        }),
      },
    );

    // ✅ data défini AVANT d'être utilisé
    const data = await response.json();

    // Log temporaire
    console.log("Status:", response.status);
    console.log("GeniusPay error:", JSON.stringify(data));

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data?.message || "Erreur GeniusPay" });
    }

    // On renvoie SEULEMENT ce dont le frontend a besoin
    res.status(200).json({
      success: true,
      reference: data.data.reference,
      checkoutUrl: data.data.checkout_url,
    });
  } catch (err) {
    console.log("Catch error:", err.message);
    res.status(500).json({ error: "Erreur serveur interne" });
  }
}

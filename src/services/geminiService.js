// src/services/geminiService.js

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// gemini-2.0-flash-exp est le bon model ID stable pour l'API REST v1beta
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Envoie l'historique de conversation à Gemini et retourne la réponse.
 *
 * IMPORTANT — Format Gemini :
 * - L'historique doit TOUJOURS commencer par un message role: 'user'
 * - Les rôles doivent ALTERNER strictement : user → model → user → model
 * - system_instruction est séparé du tableau contents
 *
 * @param {Array<{role: 'user'|'model', parts: [{text: string}]}>} history
 * @returns {Promise<string>}
 */
export async function sendMessageToGemini(history) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "VITE_GEMINI_API_KEY manquante. Vérifier le fichier .env à la racine du projet.",
    );
  }

  // Sécurité : on s'assure que l'historique commence bien par 'user'
  // et qu'il n'y a pas deux messages consécutifs du même rôle
  const sanitizedHistory = sanitizeHistory(history);

  const payload = {
    system_instruction: {
      parts: [{ text: buildSystemPrompt() }],
    },
    contents: sanitizedHistory,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };

  let response;
  try {
    response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    throw new Error(
      "Impossible de joindre l'API Gemini. Vérifier la connexion réseau.",
    );
  }

  const data = await response.json();

  if (!response.ok) {
    // Message d'erreur précis renvoyé par Google
    const msg = data?.error?.message || `Erreur HTTP ${response.status}`;
    throw new Error(`Gemini API : ${msg}`);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    // Peut arriver si Gemini bloque la réponse (safety filters)
    const reason = data?.candidates?.[0]?.finishReason;
    throw new Error(`Réponse vide. Raison : ${reason || "inconnue"}`);
  }

  return text;
}

/**
 * Garantit que l'historique respecte les contraintes de l'API Gemini :
 * - Premier message doit être role: 'user'
 * - Alternance stricte user / model
 */
function sanitizeHistory(history) {
  if (!history || history.length === 0) return [];

  const result = [];

  for (const msg of history) {
    if (result.length === 0) {
      // Forcer le premier message à être 'user'
      if (msg.role !== "user") continue;
    } else {
      const lastRole = result[result.length - 1].role;
      // Ignorer les doublons de même rôle
      if (msg.role === lastRole) continue;
    }
    result.push(msg);
  }

  return result;
}

/**
 * System prompt complet définissant le comportement de KIRA,
 * l'assistante virtuelle officielle de C.E.G.
 */
function buildSystemPrompt() {
  return `
Tu es KIRA (Knowledge & Information Resource Assistant), l'assistante virtuelle officielle de l'ONG Club Environnemental de Guinée (C.E.G).

## IDENTITÉ ET TON
- Tu es professionnelle, chaleureuse, engagée et accessible
- Tu représentes une ONG sérieuse avec des partenaires internationaux reconnus
- Tu utilises des emojis avec sobriété pour rendre les réponses vivantes 🌿
- Tes réponses sont concises, claires, et structurées (listes si nécessaire)
- À la toute première interaction, présente-toi brièvement en une phrase

## LANGUES
- Tu détectes automatiquement la langue de l'utilisateur
- Tu réponds en **français** si l'utilisateur écrit en français
- Tu réponds en **anglais** si l'utilisateur écrit en anglais
- Tu peux changer de langue à tout moment si l'utilisateur change

## CONNAISSANCES SUR C.E.G

### Informations institutionnelles
- Nom : ONG Club Environnemental de Guinée (C.E.G)
- Fondée le : 06 Novembre 2016
- Agrément officiel : A/N°7838/MATD/CAB/SERPROMA/2018
- Siège : Km 66/Maléah Centre I, Préfecture de Forécariah, République de Guinée
- Téléphones : (+224) 612 41 34 24 / (+224) 660 70 60 70
- Email : clubenvironnementaldeguinee@gmail.com

### Vision
Centrer la préservation et la conservation de l'environnement, la promotion du développement durable et l'amélioration des conditions de vie des populations en respectant les limites agroécologiques.

### Mission
Promouvoir le développement durable en réconciliant la protection de l'environnement et l'amélioration des pratiques agricoles résilientes par la mobilisation et la sensibilisation communautaire.

### 4 Domaines d'intervention
1. **Environnement et Développement Durable** — reboisement, conservation des forêts, gestion des terres, énergies renouvelables
2. **Genre, Inclusion et Gouvernance Locale** — leadership féminin, participation politique, droits des communautés
3. **Santé Communautaire Intégrée** — eau potable, hygiène, assainissement, lutte contre les maladies
4. **Recherche, Action et Formation** — études environnementales, formation des acteurs locaux, capitalisation

### Partenaires internationaux
- **GEF** — Fonds pour l'Environnement Mondial (financement principal)
- **PNUE** — Programme des Nations Unies pour l'Environnement (partenaire technique)
- **SGP/FEM** — Programme de Microfinancements (projets communautaires)

### Chiffres clés
- 8+ années d'expérience sur le terrain
- 15+ projets réalisés et documentés
- 12 000+ bénéficiaires directs
- 8 préfectures guinéennes couvertes
- 50+ communautés sensibilisées

### Réseaux sociaux
- YouTube : https://www.youtube.com/@CEGONG
- Facebook : https://www.facebook.com/share/1ENT2ivSTK/
- TikTok : https://www.tiktok.com/@ongceg
- Instagram : compte officiel C.E.G

## CE QUE TU SAIS FAIRE
✅ Présenter les projets et activités de C.E.G
✅ Expliquer les domaines d'intervention
✅ Guider vers un partenariat ou financement
✅ Donner les informations de contact
✅ Informer sur les opportunités de bénévolat
✅ Partager la vision et mission de l'ONG
✅ Communiquer les impacts et résultats
✅ Orienter les journalistes et chercheurs
✅ Répondre sur l'environnement en Guinée

## TES LIMITES
❌ Tu n'engages pas C.E.G sur des accords formels ou juridiques
❌ Tu ne communiques pas de données financières confidentielles
❌ Pour toute décision officielle : renvoyer vers clubenvironnementaldeguinee@gmail.com
❌ Tu ne traites pas de sujets hors du périmètre de C.E.G
`.trim();
}

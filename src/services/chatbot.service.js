// src/services/geminiService.js

import { toast } from "sonner";
import { buildSystemPrompt } from "../hooks/systemePrompt";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Liste ordonnée des modèles gratuits (Free Tier) pour le mécanisme de repli (Fallback)
 */
const FREE_MODELS_POOL = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

/**
 * Génère l'URL de base pour un modèle spécifique
 */
const getApiUrl = (modelName) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Envoie l'historique de conversation à Google AI Studio.
 * En cas de saturation ou d'indisponibilité, bascule automatiquement sur les modèles de secours.
 */
export async function sendMessageToAssistant(history) {
  if (!GEMINI_API_KEY) {
    toast.error(
      "Clé d'API Google manquante",
      "Veuillez configurer VITE_GEMINI_API_KEY dans votre fichier .env",
    );
    throw new Error("Votre clé d'accès Gemini est manquante.");
  }

  const contents = convertHistoryToGeminiFormat(history);

  const payload = {
    systemInstruction: {
      parts: [{ text: buildSystemPrompt() }],
    },
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  // Boucle à travers le pool de modèles disponibles
  for (let i = 0; i < FREE_MODELS_POOL.length; i++) {
    const currentModel = FREE_MODELS_POOL[i];

    try {
      // Console.log temporaire pour suivre la bascule en développement
      console.log(
        `[Dore Assistant] Tentative d'appel avec le modèle : ${currentModel}`,
      );

      const response = await fetch(getApiUrl(currentModel), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Si l'API renvoie un statut d'erreur (ex: 429 ou 503)
      if (!response.ok) {
        const errorStatus = response.status;
        const errorMsg = data?.error?.message || "Erreur inconnue";

        console.warn(
          `[Fallback] ${currentModel} a échoué (Code ${errorStatus}) : ${errorMsg}`,
        );

        // Si on a encore d'autres modèles en réserve, on passe au suivant sans lever d'erreur
        if (i < FREE_MODELS_POOL.length - 1) {
          continue;
        }

        // Si c'était le dernier modèle disponible, on propage l'erreur
        throw new Error(errorMsg);
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Réponse vide renvoyée par le modèle.");

      // Si la tentative a réussi après un échec sur le modèle principal, on prévient discrètement
      if (i > 0) {
        console.info(
          `[Fallback Succès] Basculé avec succès sur ${currentModel}`,
        );
      }

      return text;
    } catch (error) {
      // Si une erreur réseau brute (fetch échoué) survient et qu'il reste des modèles
      if (i < FREE_MODELS_POOL.length - 1) {
        console.warn(
          `[Fallback] Erreur réseau sur ${currentModel}, bascule imminente...`,
        );
        continue;
      }

      // Fin de la boucle : aucun modèle n'a fonctionné
      console.error("Tous les modèles libres ont échoué.", error);
      toast.error(
        "Assistant indisponible",
        "Les services Google sont saturés. Réessayez dans un instant.",
      );
      throw new Error(`Gemini API (Tous modèles saturés) : ${error.message}`);
    }
  }
}

/**
 * Convertit l'historique standard [{role, content}] au format Google Content.
 */
function convertHistoryToGeminiFormat(history) {
  if (!history?.length) return [];

  return history
    .filter((msg) => msg?.role && msg?.content)
    .map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));
}

// src/services/openRouterService.js

import { toast } from "sonner";
import { buildSystemPrompt } from "../hooks/systemePrompt";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

/**
 * Endpoint OpenRouter
 */
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Modèle utilisé
 * Change facilement ici :
 *
 * anthropic/claude-3.7-sonnet
 * openai/gpt-4.1-mini
 * google/gemini-2.5-flash
 * deepseek/deepseek-chat-v3-0324
 */
const MODEL = "google/gemini-2.5-flash";
// const MODEL = "google/gemini-3-flash-preview:free";
// const MODEL = "anthropic/claude-sonnet-4";

// const MODEL = "openai/gpt-5.2";
/**
 * Envoie l'historique de conversation
 * à OpenRouter et retourne la réponse.
 *
 * Format attendu :
 * [
 *   {
 *     role: "user" | "assistant",
 *     content: "..."
 *   }
 * ]
 */

export async function sendMessageToAssistant(history) {
  if (!OPENROUTER_API_KEY) {
    toast.error(
      "Clé d'API manquante",
      "Veuillez configurer votre clé d'acces.",
    );
    throw new Error("votre clef d'acces est manquante.");
  }

  const sanitizedHistory = sanitizeHistory(history);

  const payload = {
    model: MODEL,

    messages: [
      {
        role: "system",
        content: buildSystemPrompt(),
      },

      ...sanitizedHistory,
    ],

    temperature: 0.7,
    max_tokens: 1024,
  };

  let response;

  try {
    response = await fetch(OPENROUTER_API_URL, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,

        "Content-Type": "application/json",

        /**
         * Recommandés par OpenRouter
         */
        "HTTP-Referer": window.location.origin,

        "X-Title": "Dore Assistant",
      },

      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    toast.error("Erreur de connexion", "Vérifiez votre connexion réseau.");
    throw new Error("Probleme de connexion. Vérifiez votre connexion réseau.");
  }

  const data = await response.json();

  if (!response.ok) {
    const msg = data?.error?.message || `Erreur HTTP ${response.status}`;

    throw new Error(`OpenRouter API : ${msg}`);
  }

  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Réponse vide renvoyée par le modèle.");
  }

  return text;
}

/**
 * Nettoyage historique
 */

function sanitizeHistory(history) {
  if (!history?.length) {
    return [];
  }

  return history.filter((msg) => msg?.role && msg?.content);
}

/**
 * Prompt système officiel de Dore
 */

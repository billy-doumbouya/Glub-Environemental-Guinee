// src/hooks/useChatbot.js
import { useState, useCallback } from "react";
import { sendMessageToAssistant } from "../services/chatbot.service";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "Bonjour ! Je suis **Doré**, l'assistante virtuelle de l'ONG C.E.G 🌿\n\nJe peux vous renseigner sur nos projets, nos domaines d'intervention, les opportunités de partenariat, ou comment nous contacter.\n\nComment puis-je vous aider ?",
  timestamp: new Date(),
};

/**
 * Convertit les messages internes en format Gemini API.
 * - Exclut le message de bienvenue synthétique (id: 'welcome')
 * - Formate chaque message en { role, parts: [{text}] }
 */
function toAssistantHistory(messages) {
  return messages
    .filter((m) => m.id !== "welcome")
    .map((m) => ({
      role: m.role === "model" ? "assistant" : "user", // normalisation
      content: m.text, // format OpenAI standard
    }));
}
export function useChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      // 1. Ajouter le message utilisateur immédiatement
      const userMsg = {
        id: `user-${Date.now()}`,
        role: "user",
        text: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsLoading(true);
      setError(null);

      try {
        // 2. Construire l'historique Gemini avec le nouveau message inclus
        const currentMessages = [...messages, userMsg];
        const assistantHistory = toAssistantHistory(currentMessages);

        // 3. Appel API
        const responseText = await sendMessageToAssistant(assistantHistory);

        // 4. Ajouter la réponse de Dore
        const modelMsg = {
          id: `model-${Date.now()}`,
          role: "assistant",
          text: responseText,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, modelMsg]);
      } catch (err) {
        console.error("[Dore] Erreur Gemini :", err.message);
        setError(`${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages],
  );

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      sendMessage(inputValue);
    },
    [inputValue, sendMessage],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputValue);
      }
    },
    [inputValue, sendMessage],
  );

  const resetChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    setInputValue("");
  }, []);

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    messages,
    inputValue,
    isLoading,
    error,
    setInputValue,
    sendMessage,
    handleSubmit,
    handleKeyDown,
    resetChat,
    toggleOpen,
    close,
  };
}

import { chatbotService } from "../../api/services";

export async function sendMessageToAssistant(history) {
  try {
    const response = await chatbotService.sendMessage(history);
    return response.data.reply;
  } catch (error) {
    console.error("[Chatbot Client] Erreur :", error);
    throw new Error(
      error.response?.data?.error ||
        "Erreur lors de la communication avec l'assistant.",
    );
  }
}

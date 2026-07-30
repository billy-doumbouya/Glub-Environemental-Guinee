import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

/**
 * Transforme le texte brut avec **bold**, listes à puces (-), emojis et sauts de ligne
 * en éléments React élégants sans dépendance externe.
 */
function parseMarkdown(text) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let keyCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Sauts de ligne vides
    if (trimmedLine === "") {
      elements.push(<span key={`br-${keyCounter++}`} className="block h-2" />);
      continue;
    }

    // Lignes de liste avec tiret (-)
    if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      elements.push(
        <li
          key={`li-${keyCounter++}`}
          className="flex items-start gap-2 my-0.5 ml-1"
        >
          <span className="mt-2 w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0" />
          <span className="flex-1">
            {parseBold(trimmedLine.replace(/^[-*]\s*/, ""))}
          </span>
        </li>,
      );
      continue;
    }

    // Lignes commençant par des puces ou emojis (ex: ✅, 📌, ❌)
    if (/^[✅❌📌👉💡•]/.test(trimmedLine)) {
      elements.push(
        <p key={`p-emoji-${keyCounter++}`} className="leading-relaxed my-0.5">
          {parseBold(trimmedLine)}
        </p>,
      );
      continue;
    }

    // Paragraphe standard
    elements.push(
      <p key={`p-${keyCounter++}`} className="leading-relaxed my-0.5">
        {parseBold(trimmedLine)}
      </p>,
    );
  }

  return elements;
}

function parseBold(text) {
  if (!text) return "";
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-gray-900">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function formatTime(date) {
  try {
    return new Date(date || Date.now()).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const messageText = message.text || message.content || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar Assistant */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shrink-0 shadow-sm mt-0.5 border border-green-500/20">
          <Leaf className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={`flex flex-col gap-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}
      >
        {/* Bulle de message */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-green-600 text-white rounded-tr-xs"
              : "bg-white text-gray-800 border border-gray-100 rounded-tl-xs"
          }`}
        >
          {isUser ? (
            <p className="leading-relaxed whitespace-pre-wrap">{messageText}</p>
          ) : (
            <div className="space-y-0.5 text-gray-800">
              {parseMarkdown(messageText)}
            </div>
          )}
        </div>

        {/* Heure d'envoi */}
        <span className="text-[10px] text-gray-400 px-1 font-medium select-none">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}

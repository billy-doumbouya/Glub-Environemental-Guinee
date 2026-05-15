// src/components/chatbot/Chatbot.jsx
// Point d'entrée unique du chatbot.
// Usage dans App.jsx ou MainLayout.jsx :
//
//   import { Chatbot } from './components/chatbot/Chatbot'
//   ...
//   <Chatbot />
//
// C'est tout. Le composant gère son propre état via useChatbot.

import { useChatbot } from "../../hooks/useChatbot";
import { ChatTrigger } from "./ChatTrigger";
import { ChatWindow } from "./ChatWindow";

export function Chatbot() {
  const {
    isOpen,
    messages,
    inputValue,
    isLoading,
    error,
    setInputValue,
    handleSubmit,
    handleKeyDown,
    sendMessage,
    resetChat,
    toggleOpen,
    close,
  } = useChatbot();

  // Indicateur non-lu : dès qu'il y a une réponse dore et que le chat est fermé
  const hasUnread = !isOpen && messages.length > 1;

  return (
    <>
      <ChatWindow
        isOpen={isOpen}
        messages={messages}
        inputValue={inputValue}
        isLoading={isLoading}
        error={error}
        onClose={close}
        onReset={resetChat}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        onQuickReply={sendMessage}
      />

      <ChatTrigger isOpen={isOpen} unread={hasUnread} onClick={toggleOpen} />
    </>
  );
}

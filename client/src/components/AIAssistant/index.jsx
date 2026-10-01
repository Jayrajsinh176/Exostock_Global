import { useLocation } from "react-router-dom";
import AIButton from "./AIButton";
import AIChat from "./AIChat";
import AssistantHeader from "./AssistantHeader";
import ChatInput from "./ChatInput";
import ChatWindow from "./ChatWindow";
import SuggestionButtons from "./SuggestionButtons";
import useAI, { isLimitedRole } from "../../hooks/useAI";
import { AuthService } from "../../api";
import "./assistant.css";

const AIAssistant = () => {
  const location = useLocation();
  const {
    isOpen,
    loading,
    input,
    messages,
    setInput,
    openChat,
    closeChat,
    minimizeChat,
    sendMessage,
  } = useAI();

  const isPublicPage = ["/", "/login", "/register"].includes(location.pathname);

  if (
    isPublicPage ||
    !AuthService.isAuthenticated() ||
    !AuthService.hasBusinessAccess()
  )
    return null;

  return (
    <>
      <AIButton onClick={openChat} isOpen={isOpen} />

      <AIChat isOpen={isOpen}>
        <AssistantHeader onClose={closeChat} onMinimize={minimizeChat} />
        <ChatWindow messages={messages} loading={loading} />
        <SuggestionButtons
          onSelect={sendMessage}
          hideUsers={AuthService.isFranchise()}
          limited={isLimitedRole()}
        />
        <ChatInput
          value={input}
          setValue={setInput}
          onSend={sendMessage}
          loading={loading}
        />
      </AIChat>
    </>
  );
};

export default AIAssistant;

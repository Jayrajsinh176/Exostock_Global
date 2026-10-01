import { useEffect, useState } from "react";
import { sendMessageToAI } from "../services/aiService";
import { AuthService } from "../api";

const getCurrentTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export const isLimitedRole = () =>
  !AuthService.isFranchise() &&
  ["staff", "manager"].includes(AuthService.getUser()?.role);

const limitedWelcomeText = `Hello!

Welcome to ExoStock AI Assistant.

I can help you with:

Total Products
Low Stock
Billing History
Orders
Vendor Details
Categories

How can I help you today?`;

const createWelcomeMessage = () => ({
  sender: "assistant",
  text: isLimitedRole() ? limitedWelcomeText : `Hello!

Welcome to ExoStock AI Assistant.

I'm your Inventory Management Assistant.

I can help you with:

Products
Categories
Vendors
Billing
Inventory
Revenue
Dashboard
Reports

How can I help you today?`,
  time: getCurrentTime(),
});


const greetings = new Set([
  "hi",
  "hii",
  "hello",
  "hey",
  "good morning",
  "good afternoon",
  "good evening",
  "yo",
  "hola",
]);

const isGreeting = (message) => {
  const normalizedMessage = message
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return greetings.has(normalizedMessage);
};

const useAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([createWelcomeMessage()]);

  const resetChat = () => {
    setMessages([createWelcomeMessage()]);
    setInput("");
    setLoading(false);
  };

  useEffect(() => {
    const handleOpenAssistant = () => {
      resetChat();
      setIsOpen(true);
      setIsMinimized(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        resetChat();
        setIsOpen(false);
        setIsMinimized(false);
      }
    };

    window.addEventListener("open-ai-assistant", handleOpenAssistant);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("open-ai-assistant", handleOpenAssistant);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const openChat = () => {
    resetChat();
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeChat = () => {
    resetChat();
    setIsOpen(false);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    resetChat();
    setIsMinimized(true);
    setIsOpen(false);
  };

  const sendMessage = async (question = input) => {
    const messageText = typeof question === "string" ? question : input;
    const cleanQuestion = messageText.trim();
    if (!cleanQuestion || loading) return;

    const userMessage = {
      sender: "user",
      text: cleanQuestion,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (isGreeting(cleanQuestion)) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: createWelcomeMessage().text,
          time: getCurrentTime(),
        },
      ]);
      return;
    }

    setLoading(true);

    try {
      const response = await sendMessageToAI(cleanQuestion);
      const aiMessage = {
        sender: "assistant",
        text: response.reply,
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Assistant message error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "Something went wrong. Please try again.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    isMinimized,
    loading,
    input,
    messages,
    setInput,
    openChat,
    closeChat,
    minimizeChat,
    sendMessage,
  };
};

export default useAI;

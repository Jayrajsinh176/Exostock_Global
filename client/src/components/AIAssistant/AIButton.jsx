import { Bot } from "lucide-react";

const AIButton = ({ onClick, isOpen }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open ExoStock AI Assistant"
      className={`fixed bottom-5 right-5 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-[#0d5b96] text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(13,91,150,0.45)] focus:outline-none focus:ring-4 focus:ring-[#0d5b96]/30 ${isOpen ? "scale-95 opacity-80" : "ai-button-pulse"}`}
    >
      <Bot size={28} />
    </button>
  );
};

export default AIButton;

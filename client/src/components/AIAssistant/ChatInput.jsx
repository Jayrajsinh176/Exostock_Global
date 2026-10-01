import { useEffect, useRef } from "react";
import { SendHorizonal } from "lucide-react";

const ChatInput = ({ value, setValue, onSend, loading = false }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(focusTimer);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (!loading && value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder="Ask about inventory..."
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#0d5b96] disabled:opacity-70"
        />

        <button
          type="button"
          onClick={() => onSend()}
          disabled={loading || !value.trim()}
          aria-label="Send message"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0d5b96] text-white transition hover:bg-[#0a4d82] disabled:opacity-50"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

import { useState } from "react";
import { MdSupportAgent, MdClose } from "react-icons/md";
import toast from "react-hot-toast";

const initialMessages = [
  {
    id: 1,
    from: "bot",
    text: "Hi there! Need help with your plan or a feature?",
  },
];

const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) {
      toast.error("Type a message before sending.");
      return;
    }

    const userMessage = {
      id: Date.now(),
      from: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "bot",
          text: "Thanks for your message! Our team will get back to you via email shortly.",
        },
      ]);
      toast.success("Support message sent.");
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="w-[320px] bg-white border border-[#E5E7EB] shadow-2xl rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#111827] text-white">
            <div className="flex items-center gap-2">
              <MdSupportAgent className="text-[20px]" />
              <div>
                <p className="text-sm font-semibold">Support Bot</p>
                <p className="text-[11px] text-[#D1D5DB]">Chat with support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-white/10"
            >
              <MdClose className="text-[18px]" />
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-4 space-y-3 bg-[#F9FAFB]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl p-3 text-[14px] leading-relaxed ${
                  message.from === "bot"
                    ? "bg-[#E5E7EB] text-[#111827] self-start"
                    : "bg-[#111827] text-white self-end"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 px-4 py-3 border-t border-[#E5E7EB] bg-white">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-2xl border border-[#D1D5DB] px-3 py-2 text-[14px] outline-none focus:border-[#111827]"
            />
            <button
              onClick={handleSend}
              className="rounded-2xl bg-[#111827] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#1f2937]"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#111827] px-4 py-3 text-white shadow-2xl hover:bg-[#1f2937]"
        >
          <MdSupportAgent className="text-[20px]" />
          Support
        </button>
      )}
    </div>
  );
};

export default SupportWidget;

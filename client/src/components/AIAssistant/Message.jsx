import { Bot, User } from "lucide-react";

const Message = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[85%] items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isUser ? "bg-[#0d5b96] text-white" : "bg-[#eaf3fb] text-[#0d5b96]"
          }`}
        >
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>

        <div
          className={`rounded-2xl border px-4 py-3 shadow-sm ${
            isUser
              ? "rounded-br-sm border-[#0d5b96] bg-[#0d5b96] text-white"
              : "rounded-bl-sm border-gray-100 bg-white text-gray-900"
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.text}
          </p>

          <p
            className={`mt-2 text-[10px] ${isUser ? "text-blue-100" : "text-gray-500"}`}
          >
            {message.time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;

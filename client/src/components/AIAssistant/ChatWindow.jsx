import { useEffect, useRef } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";

const ChatWindow = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="ai-scrollbar flex-1 overflow-y-auto bg-gray-50 p-4">
      {messages.map((message, index) => (
        <Message
          key={`${message.sender}-${message.time}-${index}`}
          message={message}
        />
      ))}

      {loading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;

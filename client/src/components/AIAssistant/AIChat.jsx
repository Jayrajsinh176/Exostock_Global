const AIChat = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-24 right-4 z-[9999] flex h-[min(600px,calc(100vh-8rem))] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl text-gray-900 sm:right-6"
      role="dialog"
      aria-label="ExoStock AI Assistant"
    >
      {children}
    </div>
  );
};

export default AIChat;

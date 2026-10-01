const TypingIndicator = () => {
  return (
    <div className="mb-4 flex justify-start">
      <div className="flex max-w-[85%] items-end gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
          <span className="text-lg">✦</span>
        </div>

        <div className="rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.1s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

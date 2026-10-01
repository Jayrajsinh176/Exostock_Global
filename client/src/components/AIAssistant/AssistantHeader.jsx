import { Bot, Minimize2, X } from "lucide-react";

const AssistantHeader = ({ onClose, onMinimize }) => {
  return (
    <div className="flex items-center justify-between bg-[#0d5b96] px-5 py-4 text-white">
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-full bg-white p-2 text-[#0d5b96]">
          <Bot size={22} />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold leading-tight sm:text-base">
            ExoStock AI Assistant
          </h2>

          <p className="flex items-center gap-1 text-[10px] opacity-90 sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Online
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMinimize}
          aria-label="Minimize AI Assistant"
          className="rounded-full p-2 transition hover:bg-white/20"
        >
          <Minimize2 size={18} />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI Assistant"
          className="rounded-full p-2 transition hover:bg-white/20"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default AssistantHeader;

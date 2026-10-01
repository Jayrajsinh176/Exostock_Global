import { MdWarning, MdClose } from "react-icons/md";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-start justify-between">
          <div className="flex items-start gap-3">
            {isDangerous ? (
              <MdWarning className="text-[#DC3545] text-[24px] flex-shrink-0 mt-1" />
            ) : (
              <MdWarning className="text-[#FFC107] text-[24px] flex-shrink-0 mt-1" />
            )}
            <h2 className="text-[16px] font-bold text-[#212529]">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-[#6C757D] hover:text-[#212529] transition-colors"
          >
            <MdClose className="text-[20px]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          <p className="text-[14px] text-[#6C757D] leading-relaxed">
            {message}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F8F9FA] border-t border-[#DEE2E6] flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-semibold text-[#212529] hover:bg-[#F8F9FA] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-[14px] font-semibold text-white transition-colors ${
              isDangerous
                ? "bg-[#DC3545] hover:bg-[#c82333]"
                : "bg-[#0d5b96] hover:bg-[#1A1A1A]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

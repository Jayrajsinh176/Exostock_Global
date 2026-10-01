import { useEffect, useState } from 'react';
import { MdClose, MdError } from 'react-icons/md';
import { termsSections } from '../landing/TermsOfServicePage';

const TermsModal = ({ open, onClose, onAccept, loading = false, error = '' }) => {
  const [agreed, setAgreed] = useState(false);

  // Reset checkbox each time the modal opens; lock page scroll while open
  useEffect(() => {
    if (!open) return;
    setAgreed(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
        className="flex max-h-full w-full max-w-[640px] flex-col rounded-2xl border-2 border-[#0d5b96] bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 id="terms-modal-title" className="text-[18px] font-semibold text-[#0d5b96]">
              Terms of Service
            </h2>
            <p className="text-[12px] font-semibold text-[#0d5b96]">
              Please read and accept to create your account
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-[#0d5b96] transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Scrollable terms */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {termsSections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.id} className="border-b border-gray-100 py-4 last:border-b-0">
                <h3 className="mb-2 flex items-center gap-2 text-[15px] font-bold text-[#083d67]">
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  {section.title}
                </h3>
                <div className="text-[13px] leading-6 text-gray-600 [&_li]:pl-1 [&_p:last-child]:mb-0 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
                  {section.content}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer: acceptance */}
        <div className="border-t border-gray-200 px-5 py-4">
          {error && (
            <div className="mb-3 rounded-lg border border-[#F5C6CB] bg-[#F8D7DA] p-2">
              <p className="flex items-center gap-1 text-[12px] text-[#721C24]">
                <MdError className="flex-shrink-0 text-[12px]" />
                <span>{error}</span>
              </p>
            </div>
          )}

          <label className="flex cursor-pointer items-start gap-2 text-[13px] text-[#0d5b96]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={loading}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#0d5b96]"
            />
            <span>I have read and agree to the ExoStock Terms of Service.</span>
          </label>

          <button
            type="button"
            onClick={onAccept}
            disabled={!agreed || loading}
            className="mt-4 flex h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-[#0d5b96] text-[14px] font-semibold text-white transition-all duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Account...
              </>
            ) : (
              <>Agree &amp; Register <span className="text-white">→</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;

const BrandMark = ({
  compact = false,
  className = "",
  showPowered = !compact,
}) => {
  const logoClass = compact
    ? "h-11 sm:h-12"
    : "h-10 sm:h-12 lg:h-14";

  return (
    <div
      className={`inline-flex min-w-0 max-w-full ${
        compact ? "items-center gap-2 sm:gap-3" : "flex-col items-center gap-1.5"
      } ${className}`}
    >
      <a href="/" className="min-w-0 max-w-full shrink-0">
        <img
          src="/logo.png"
          alt="ExoStock"
          className={`w-auto object-contain ${logoClass}`}
        />
      </a>
      {showPowered && (
        <span className="text-[11px] text-gray-600 sm:text-xs">
          Powered by{" "}
          <a
            href="https://exoticinfotech.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#0d5b96] hover:underline"
          >
            Exotic Infotech
          </a>
        </span>
      )}
    </div>
  );
};

export default BrandMark;

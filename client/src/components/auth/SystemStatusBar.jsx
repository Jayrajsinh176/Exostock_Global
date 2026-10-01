const SystemStatusBar = () => {
  return (
    <div className="flex items-center justify-center gap-8 pb-6">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#28A745] inline-block animate-pulse"></span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6C757D]">Cloud Active</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#28A745] inline-block animate-pulse"></span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6C757D]">Secure Node</span>
      </div>
      <div className="ml-auto text-[11px] font-mono text-[#ADB5BD] tracking-widest">
        V2.4.0·FINAL
      </div>
    </div>
  );
};

export default SystemStatusBar;

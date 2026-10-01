const suggestions = [
  "Inventory Value",
  "Total Products",
  "Today's Sales",
  "Revenue",
  "Low Stock",
  "Billing History",
  "Product History",
  "Orders",
  "Vendor Details",
  "Categories",
  "Users",
  "Franchises",
  "Dashboard Summary",
];

const limitedSuggestions = [
  "Total Products",
  "Low Stock",
  "Billing History",
  "Orders",
  "Vendor Details",
  "Categories",
];

const SuggestionButtons = ({ onSelect, hideUsers, limited }) => {
  const visibleSuggestions = limited
    ? limitedSuggestions
    : hideUsers
      ? suggestions.filter(
          (item) => item !== "Users" && item !== "Franchises",
        )
      : suggestions;

  return (
    <div className="ai-scrollbar flex gap-2 overflow-x-auto border-t border-gray-100 bg-white px-4 py-3">
      {visibleSuggestions.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onSelect(item)}
          className="shrink-0 rounded-full bg-[#eaf3fb] px-3 py-2 text-[11px] font-medium text-[#0d5b96] transition hover:bg-[#0d5b96] hover:text-white sm:text-xs"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default SuggestionButtons;

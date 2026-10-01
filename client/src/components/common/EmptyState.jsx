import {
  MdInfoOutline,
  MdInventory2,
  MdCategory,
  MdPerson,
  MdAdd,
} from "react-icons/md";

/**
 * Reusable EmptyState component for displaying when no data is available
 * @param {string} title - Main title text
 * @param {string} description - Descriptive text
 * @param {string} type - Type of empty state: 'products', 'categories', 'users', 'notifications', 'default'
 * @param {function} onAction - Optional action button callback
 * @param {string} actionLabel - Optional action button label
 */
const EmptyState = ({
  title = "No Data Available",
  description = "There is nothing to display here yet.",
  type = "default",
  onAction,
  actionLabel,
}) => {
  const getIcon = () => {
    switch (type) {
      case "products":
        return <MdInventory2 className="text-[40px] text-[#0d5b96]" />;
      case "categories":
        return <MdCategory className="text-[40px] text-[#28A745]" />;
      case "users":
        return <MdPerson className="text-[40px] text-[#6610F2]" />;
      case "notifications":
        return <MdInfoOutline className="text-[40px] text-[#FFC107]" />;
      default:
        return <MdInfoOutline className="text-[40px] text-[#6C757D]" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "products":
        return "bg-[#F1F3F5]";
      case "categories":
        return "bg-[#D1FAE5]";
      case "users":
        return "bg-[#EDE9FE]";
      case "notifications":
        return "bg-[#FEF3C7]";
      default:
        return "bg-[#F8F9FA]";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div
        className={`w-20 h-20 ${getBackgroundColor()} rounded-full flex items-center justify-center mb-6`}
      >
        {getIcon()}
      </div>

      <h3 className="text-[18px] font-semibold text-[#212529] mb-2">{title}</h3>
      <p className="text-[14px] text-[#6C757D] max-w-md mb-6">{description}</p>

      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0d5b96] text-white rounded-lg font-semibold hover:bg-[#1A1A1A] transition-colors"
        >
          <MdAdd className="text-[18px]" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

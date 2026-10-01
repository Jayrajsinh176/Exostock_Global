import { MdCheckCircle, MdSchedule, MdError, MdLightbulb } from 'react-icons/md';

const InventoryHealthFeed = () => {
  const events = [
    {
      type: 'arrival',
      title: 'Bulk Arrival',
      description: 'Section A12',
      detail: '+450 Units',
      time: '2 mins ago',
      icon: MdCheckCircle,
      color: '#28A745',
    },
    {
      type: 'pending',
      title: 'Reorder Pending',
      description: 'SKU-902',
      detail: 'Waiting Approval',
      time: '45 mins ago',
      icon: MdSchedule,
      color: '#FFC107',
    },
    {
      type: 'warning',
      title: 'Stockout Warning',
      description: 'Batch 04',
      detail: 'Action Required',
      time: '2 hours ago',
      icon: MdError,
      color: '#DC3545',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {/* Inventory Health Timeline */}
      <div className="col-span-2 bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md">
        <h3 className="text-[18px] font-semibold text-[#212529] mb-6">Inventory Health</h3>

        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex gap-4 pb-4 border-b border-[#F1F3F5] last:border-0 last:pb-0">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${event.color}20` }}>
                  {event.icon && <event.icon className="text-[20px]" style={{ color: event.color }} />}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#212529]">{event.title}</p>
                <p className="text-[13px] text-[#6C757D]">
                  {event.description} • {event.time}
                </p>
              </div>

              {/* Detail */}
              <div className="flex-shrink-0 text-right">
                <p className="text-[13px] font-semibold text-[#212529]">{event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architect's Tip Callout */}
      <div className="bg-[#212529] border border-[#212529] rounded-lg p-5">
        <div className="flex gap-3 mb-3">
          <span className="text-[20px] text-white flex-shrink-0">💡</span>
          <h4 className="text-[14px] font-semibold text-white">ARCHITECT'S TIP</h4>
        </div>
        <p className="text-[13px] text-white leading-relaxed">
          System optimization suggests reallocating storage from Category B to Category D to reduce retrieval latency.
        </p>
      </div>
    </div>
  );
};

export default InventoryHealthFeed;

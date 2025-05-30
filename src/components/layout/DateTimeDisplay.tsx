import React from "react";

interface DateTimeDisplayProps {
  dateTime: Date | null;
  collapsed: boolean;
}

const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({ dateTime, collapsed }) => {
  if (collapsed) return null;

  const formattedDate =
    dateTime?.toLocaleDateString("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) ?? "N/A";

  const formattedTime =
    dateTime?.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }) ?? "N/A";

  return (
    <div className="text-[#0038A8] px-3 py-2 leading-none">
      <div className="text-xs md:text-sm lg:text-2xl font-bold leading-none mb-0">
        {formattedTime}
      </div>
      <div className="text-xs leading-none mt-0">{formattedDate}</div>
    </div>
  );
};

export default DateTimeDisplay;

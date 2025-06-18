import React from "react";
import dayjs from "dayjs";

const MonthSummaryPage = (data: { month: number; year: number }) => {
  const currentMonth = new Date(data.year, data.month);
  const daysInMonth = dayjs(currentMonth).daysInMonth();
  const monthName = dayjs(currentMonth).format("MMM");

  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-[#0038A8] py-5 px-3 rounded-xl text-white w-full max-w-2xl mx-auto text-center">
      <h2 className="text-sm md:text-base font-semibold">
        {monthName.toUpperCase()}
      </h2>
      <div className="w-full h-[2px] bg-gray-400 opacity-100 my-1" />
      <ul className="space-y-2 mt-4">
        {dayNumbers.map((day, index) => (
          <li key={index} className="text-sm md:text-lg text-gray-300">
            {day}
            <div className="w-full h-[2px] bg-gray-400 opacity-100 my-1" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthSummaryPage;

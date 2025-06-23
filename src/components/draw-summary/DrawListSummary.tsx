import React, { useState } from "react";

const MonthSummaryPage = React.lazy(
  () => import("~/components/draw-summary/MonthSummary")
);

const FirstSummaryPage = React.lazy(
  () => import("~/components/draw-summary/FirstSummary")
);

const DrawListSummaryPage = (data: {
  location: string;
  month: number;
  values: { firstDraw: string[]; secondDraw: string[]; thirdDraw: string[] }[];
}) => {
  const today = new Date();
  const [activeMobileTab, setActiveMobileTab] = useState(1);
  const getValuesByDrawOrder = (order: number) => {
    switch (order) {
      case 1:
        return data.values.map((result) => result.firstDraw);
      case 2:
        return data.values.map((result) => result.secondDraw);
      case 3:
        return data.values.map((result) => result.thirdDraw);
      default:
        return [];
    }
  };

  return (
    <React.Fragment>
      <h2 className="text-base md:text-xl font-semibold">
        {data.location} Draw List Summary
      </h2>

      <div className="flex gap-1 xl:hidden">
        {["First Draw", "Second Draw", "Third Draw"].map((label, index) => (
          <button
            key={label}
            className={`px-3 lg:px-1 py-1 rounded-full text-xs font-medium border ${
              activeMobileTab === index + 1
                ? "bg-[#0038A8] text-white"
                : "bg-none text-[#0038A8] border-[#0038A8]"
            }`}
            onClick={() => setActiveMobileTab(index + 1)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 xl:hidden">
        <MonthSummaryPage month={data.month - 1} year={today.getFullYear()} />
        <FirstSummaryPage
          drawOrder={activeMobileTab}
          values={getValuesByDrawOrder(activeMobileTab)}
        />
      </div>

      <div className="hidden xl:grid xl:grid-cols-4 gap-3 ">
        <MonthSummaryPage month={data.month - 1} year={today.getFullYear()} />
        <FirstSummaryPage drawOrder={1} values={getValuesByDrawOrder(1)} />
        <FirstSummaryPage drawOrder={2} values={getValuesByDrawOrder(2)} />
        <FirstSummaryPage drawOrder={3} values={getValuesByDrawOrder(3)} />
      </div>
    </React.Fragment>
  );
};

export default DrawListSummaryPage;

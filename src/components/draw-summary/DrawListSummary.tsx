import React, { useState } from "react";

const MonthSummaryPage = React.lazy(
  () => import("@/components/draw-summary/MonthSummary")
);

const FirstSummaryPage = React.lazy(
  () => import("@/components/draw-summary/FirstSummary")
);

const DrawListSummaryPage = (data: {
  location: string;
  month: number;
  values: { firstDraw: string[]; secondDraw: string[]; thirdDraw: string[] }[];
  loading?: boolean;
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

  const SkeletonCard = () => (
    <div className="bg-gray-200 min-h-[540px] rounded-md animate-pulse w-full" />
  );

  return (
    <React.Fragment>
      <h2 className="text-base md:text-xl font-semibold mb-3">
        {data.loading ? (
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        ) : (
          `${data.location} Draw List Summary`
        )}
      </h2>

      <div className="flex gap-1 xl:hidden mb-3">
        {["First Draw", "Second Draw", "Third Draw"].map((label, index) => (
          <button
            key={label}
            className={`px-3 lg:px-1 py-1 rounded-full text-xs font-medium border ${
              activeMobileTab === index + 1
                ? "bg-[#0038A8] text-white"
                : "bg-none text-[#0038A8] border-[#0038A8]"
            }`}
            onClick={() => setActiveMobileTab(index + 1)}
            disabled={data.loading}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 xl:hidden">
        {data.loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <MonthSummaryPage
              month={data.month - 1}
              year={today.getFullYear()}
            />
            <FirstSummaryPage
              drawOrder={activeMobileTab}
              values={getValuesByDrawOrder(activeMobileTab)}
            />
          </>
        )}
      </div>

      <div className="hidden xl:grid xl:grid-cols-4 gap-3">
        {data.loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <MonthSummaryPage
              month={data.month - 1}
              year={today.getFullYear()}
            />
            <FirstSummaryPage drawOrder={1} values={getValuesByDrawOrder(1)} />
            <FirstSummaryPage drawOrder={2} values={getValuesByDrawOrder(2)} />
            <FirstSummaryPage drawOrder={3} values={getValuesByDrawOrder(3)} />
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default DrawListSummaryPage;

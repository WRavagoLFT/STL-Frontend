import React from "react";

const MonthSummaryPage = React.lazy(
  () => import("~/components/draw-summary/MonthSummary")
);

const FirstSummaryPage = React.lazy(
  () => import("~/components/draw-summary/FirstSumarry")
);

const DrawListSummaryPage = (data: {
  location: string,
  month: number,
  values: {firstDraw: string[], secondDraw: string[], thirdDraw: string[]}[]
}) => {

  //console.log("Transformed data: ", data.values)
  const today = new Date()

  return (
    <React.Fragment>
      <h2 className="text-xl font-semibold">{data.location} Draw List Summary</h2>
      <div className="min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MonthSummaryPage month={data.month - 1} year={today.getFullYear()} />
        <FirstSummaryPage drawOrder={1} values={data.values.map((result) => result.firstDraw)} />
        <FirstSummaryPage drawOrder={2} values={data.values.map((result) => result.secondDraw)} />
        <FirstSummaryPage drawOrder={3} values={data.values.map((result) => result.thirdDraw)} />
      </div>
    </React.Fragment>
  );
};

export default DrawListSummaryPage;

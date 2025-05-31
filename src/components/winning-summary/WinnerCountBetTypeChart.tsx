import React, { useState } from "react";
import { Box, Typography, Stack, Button, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import {TodaysWinnerCountByGameTypeData,addLabelsGameTypes } from "~/components/winning-summary/tooltips/dataSet";
import { buttonStyles } from "~/styles/theme";
// import { fetchHistoricalSummary, fetchTransactions } from "~/utils/api/transactions";
// import { fetchWinners } from "~/utils/api/winners";
// import fetchHistoricalSummary from "~/utils/api/transactions/getHistoricalSummary";

// Mapping GameTypeId to Draw Names
// const drawNames: Record<number, string> = {
//   1: "First Draw",
//   2: "Second Draw",
//   3: "Third Draw",
// };

// Custom Legend (Dynamically Handles Bet Types)
const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#E5C7FF] mr-2" />
      <p className="text-sm">Tumbok</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#D2A7FF] mr-2" />
      <p className="text-sm">Sahod</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#BB86FC] mr-2" />
      <p className="text-sm">Ramble</p>
    </div>
  </div>
);

const ChartWinnersBetTypeSummary = (params: {gameCategoryId?: number}) => {
  const [loading, setLoading] = useState(true);
  // const [data, setData] = useState<
  //     { draw: string; tumbok: number, sahod: number, ramble: number }[]
  //   >([]);
  // const [loading, setLoading] = useState(false);

  const xAxisTicks = [
    0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100,
  ];

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">
            Today's Winnings by Game Type
          </p>
          <CustomLegend />
        </div>
        <Button sx={buttonStyles} variant="contained">
          Export as CSV
        </Button>
      </div>

      <div className="h-full w-full">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <CircularProgress />
          </div>
        ) : (
          <BarChart
            height={300}
            // width={{100%}}
            grid={{ vertical: true }}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            slotProps={{ legend: { hidden: true } }}
            dataset={TodaysWinnerCountByGameTypeData}
            yAxis={[
              {
                scaleType: "band",
                data: ["First Draw", "Second Draw", "Third Draw"], 
                // series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }]},
              },
            ]}
            xAxis={[
              {
                label: "Amount (in 100,000 units)",
                // scaleType: "linear",
                min: 0, 
                max: 100,
                //tickValues: xAxisTicks,
                //tickSpacing:1 ,
              },
            ]}
            series={addLabelsGameTypes([
              { dataKey: 'STL_Pares', color: '#E5C7FF' },
              { dataKey: 'STL_Swer2', color: '#5050A5' },
              { dataKey: 'STL_Swer3', color: '#7266C9' },
              { dataKey: 'STL_Swer4', color: '#3B3B81' }
            ])}
          />
        )}
      </div>
    </div>
  );
};

export default ChartWinnersBetTypeSummary;

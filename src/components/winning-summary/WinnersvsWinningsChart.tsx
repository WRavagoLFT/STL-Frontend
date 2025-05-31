import {
  CircularProgress,
  Button,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { TodaysWinnersAndWinsData, addLabels } from "./tooltips/dataSet";
import { buttonStyles } from "~/styles/theme";
import { useState } from "react";

// Custom Legend (Dynamically Handles Bet Types)
const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#E5C7FF] mr-2" />
      <p className="text-sm">Winners</p> 
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-2" />
      <p className="text-sm">Winnings</p>
    </div>
  </div>
);

const ChartWinnersvsWinningsSummary = (params: { gameCategoryId?: number }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
   { draw: string; winners: number; winnings: number }[]
  >([]);

  const xAxisTicks = [
    0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100,
  ];

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">
            Today&apos;s Winners and Winnings
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
            grid={{ vertical: true }}
            layout="horizontal"
            //backgroundColor = "transparent"
            slotProps={{ legend: { hidden: true } }}
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            dataset={TodaysWinnersAndWinsData}
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
                //tickSpacing: 1 ,
              },
            ]}
            series={addLabels([
              { dataKey: "winners", color: "#E5C7FF" },
              { dataKey: "winnings", color: "#5050A5" },
            ])}
          />
        )}
      </div>
    </div>
  );
};

export default ChartWinnersvsWinningsSummary;

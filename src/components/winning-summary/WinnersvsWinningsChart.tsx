import {
  CircularProgress,
  Button,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
// import { fetchHistoricalSummary } from "~/utils/api/transactions";
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // setLoading(true);
  //     try {
  //       const response = await fetchHistoricalSummary(); // Add query params if needed

  //       const today = new Date().toISOString().split("T")[0];
  //         console.log(today); // Output: "2025-03-25T00:00:00.000Z"

  //         // Filter Data for Today's Date
  //         let res = response.data.filter((item: { TransactionDate: string }) =>
  //           item.TransactionDate.startsWith(today)
  //         );

  //         if (params.gameCategoryId && params.gameCategoryId > 0) {
  //           res = res.filter((item: { GameCategoryId: number }) =>
  //             item.GameCategoryId === params.gameCategoryId
  //           );
  //         }

  //       if (response.success && Array.isArray(res)) {
  //         // Aggregate data by GameTypeId
  //         const aggregatedData: Record<
  //           number,
  //           { winners: number; winnings: number }
  //         > = {};

  //         res.forEach(
  //           (item: {
  //             DrawOrder: number;
  //             TotalWinners: number;
  //             TotalPayout: number;
  //           }) => {
  //             if (!aggregatedData[item.DrawOrder]) {
  //               aggregatedData[item.DrawOrder] = { winners: 0, winnings: 0 };
  //             }

  //             aggregatedData[item.DrawOrder].winners += item.TotalWinners;
  //             aggregatedData[item.DrawOrder].winnings += item.TotalPayout;
  //           }
  //         );

  //         // Convert aggregated data into the required format
  //         const formattedData = [
  //           {
  //             draw: "First Draw",
  //             winners: aggregatedData[1]?.winners || 0,
  //             winnings: aggregatedData[1]?.winnings || 0,
  //           },
  //           {
  //             draw: "Second Draw",
  //             winners: aggregatedData[2]?.winners || 0,
  //             winnings: aggregatedData[2]?.winnings || 0,
  //           },
  //           {
  //             draw: "Third Draw",
  //             winners: aggregatedData[3]?.winners || 0,
  //             winnings: aggregatedData[3]?.winnings || 0,
  //           },
  //         ];

  //         setData(formattedData);
  //         // setLoading(false);
  //       }
  //     } catch (error) {
  //       console.log(
  //         "Error loading BettorsvsBetsPlacedSummary: " +
  //           (error as Error).message
  //       );
  //     }
  //   };

  //   fetchData();
  //   console.log(`Bettors vs Bets Placed Summary Data: ${data}`);
  // }, []);

  // const maxX = Math.max(
  //   70,
  //   ...data.map((item) => item.bettors / 10000),
  //   ...data.map((item) => item.bets / 100000)
  // );
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

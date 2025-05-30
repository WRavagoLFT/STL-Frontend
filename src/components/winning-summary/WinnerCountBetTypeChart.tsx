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
  <Stack
    direction="row"
    spacing={2}
    justifyContent="left"
    sx={{ mt: 0.5, mr: 4 }}
    fontSize={12}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#E5C7FF",
          mr: 1.5,
        }}
      />
      <Typography color="#212121">Tumbok</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#D2A7FF",
          mr: 1.5,
        }}
      />
      <Typography color="#212121">Sahod</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#BB86FC",
          mr: 1.5,
        }}
      />
      <Typography color="#212121">Ramble</Typography>
    </Box>
  </Stack>
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

  // useEffect(() => {
  //     const fetchData = async () => {
  //       setLoading(true);
  //       try {
  //         const response = await fetchWinners(); // Add query params if needed
  //         console.log(response)
  //         const today = new Date().toISOString().split("T")[0];
  //         console.log(today); // Output: "2025-03-25T00:00:00.000Z"

  //         // Filter Data for Today's Date
  //         let res = response.data.filter((item: { DateOfWinningCombination: string, GameCategoryId: number }) =>
  //           item.DateOfWinningCombination.startsWith(today)
  //         );

  //         if(params.gameCategoryId && params.gameCategoryId > 0) {
  //           res = res.filter((item: { GameCategoryId: number }) =>
  //             item.GameCategoryId === params.gameCategoryId
  //           );
  //         }
          
  //         console.log("bet types", res)
  
  //         if (response.success && Array.isArray(res)) {
  //           // Aggregate data by GameTypeId
  //           const aggregatedData: Record<
  //             number,
  //             { tumbok: number; sahod: number; ramble: number }
  //           > = {};
  
  //           res.forEach(
  //             (item: {
  //               DrawOrder: number;
  //               Tumbok: number;
  //               Sahod: number;
  //               Ramble: number;
  //               GameCategoryId: number;
  //               PayoutAmount: number;
  //               WinType: string
  //             }) => {
  //               if (!aggregatedData[item.DrawOrder]) {
  //                 aggregatedData[item.DrawOrder] = { tumbok: 0, sahod: 0, ramble: 0 };
  //               }
  
  //               aggregatedData[item.DrawOrder].tumbok += item.WinType == "Tumbok" ? item.PayoutAmount : 0;
  //               aggregatedData[item.DrawOrder].sahod += item.WinType == "Sahod" ? item.PayoutAmount : 0;
  //               aggregatedData[item.DrawOrder].ramble += item.WinType == "Ramble" ? item.PayoutAmount : 0;
  //             }
  //           );
  
  //           // Convert aggregated data into the required format
  //           const formattedData = [
  //             {
  //               draw: "First Draw",
  //               tumbok: aggregatedData[1]?.tumbok || 0,
  //               sahod: aggregatedData[1]?.sahod || 0,
  //               ramble: aggregatedData[1]?.ramble || 0,
  //             },
  //             {
  //               draw: "Second Draw",
  //               tumbok: aggregatedData[2]?.tumbok || 0,
  //               sahod: aggregatedData[2]?.sahod || 0,
  //               ramble: aggregatedData[2]?.ramble || 0,
  //             },
  //             {
  //               draw: "Third Draw",
  //               tumbok: aggregatedData[3]?.tumbok || 0,
  //               sahod: aggregatedData[3]?.sahod || 0,
  //               ramble: aggregatedData[3]?.ramble || 0,
  //             },
  //           ];
  
  //           setData(formattedData);
  //           console.log(formattedData)
  //           setLoading(false);
  //         }
  //       } catch (error) {
  //         console.log(
  //           "Error loading BettorsvsBetsPlacedSummary: " +
  //             (error as Error).message
  //         );
  //       }
  //     };
  
  //     fetchData();
  //     console.log(`Bettors vs Bets Placed Summary Data: ${data}`);
  //   }, []);

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

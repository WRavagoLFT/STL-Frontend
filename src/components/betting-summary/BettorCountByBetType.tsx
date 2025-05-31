import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchTransactions } from "~/utils/api/transactions";
import {
  TodaysBettorCountByGameTypeData,
  addLabelsBets,
  addLabelsGameTypes,
} from "~/components/betting-summary/tooltips/dataSet";
import { buttonStyles } from "~/styles/theme";
// import fetchHistoricalSummary from "~/utils/api/transactions/getHistoricalSummary";

// Custom Legend (Dynamically Handles Bet Types)
const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#E5C7FF] mr-2" />
      <p className="text-sm">Tumbok</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-2" />
      <p className="text-sm">Sahod</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#7266C9] mr-2" />
      <p className="text-sm">Ramble</p>
    </div>
  </div>
);

const ChartBettorsBetTypeSummary = (params: { gameCategoryId?: number }) => {
  // const ChartBettorsBetTypeSummary = () => {
  const [data, setData] = useState<
    { draw: string; tumbok: number; sahod: number; ramble: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const xAxisTicks = [
    0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100,
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split("T")[0];
        console.log(today); // Output: "2025-03-25T00:00:00.000Z"
        const response = await fetchTransactions({ from: today, to: today }); // Add query params if needed
        console.log(response);

        // Filter Data for Today's Date
        let res = response.data.filter(
          (item: { DateOfTransaction: string; GameCategoryId: number }) =>
            item.DateOfTransaction.startsWith(today)
        );

        if (params.gameCategoryId && params.gameCategoryId > 0) {
          res = res.filter(
            (item: { GameCategoryId: number }) =>
              item.GameCategoryId === params.gameCategoryId
          );
        }

        console.log("BettorCountByBetType Response:", res);

        if (response.success && Array.isArray(res)) {
          // Aggregate data by GameTypeId
          const aggregatedData: Record<
            number,
            { tumbok: number; sahod: number; ramble: number }
          > = {};

          res.forEach(
            (item: {
              DrawOrder: number;
              Tumbok: number;
              Sahod: number;
              Ramble: number;
              GameCategoryId: number;
            }) => {
              if (!aggregatedData[item.DrawOrder]) {
                aggregatedData[item.DrawOrder] = {
                  tumbok: 0,
                  sahod: 0,
                  ramble: 0,
                };
              }

              aggregatedData[item.DrawOrder].tumbok += item.Tumbok;
              aggregatedData[item.DrawOrder].sahod += item.Sahod;
              aggregatedData[item.DrawOrder].ramble += item.Ramble;
            }
          );

          // Convert aggregated data into the required format
          const formattedData = [
            {
              draw: "First Draw",
              tumbok: aggregatedData[1]?.tumbok || 0,
              sahod: aggregatedData[1]?.sahod || 0,
              ramble: aggregatedData[1]?.ramble || 0,
            },
            {
              draw: "Second Draw",
              tumbok: aggregatedData[2]?.tumbok || 0,
              sahod: aggregatedData[2]?.sahod || 0,
              ramble: aggregatedData[2]?.ramble || 0,
            },
            {
              draw: "Third Draw",
              tumbok: aggregatedData[3]?.tumbok || 0,
              sahod: aggregatedData[3]?.sahod || 0,
              ramble: aggregatedData[3]?.ramble || 0,
            },
          ];

          setData(
            formattedData.map((item) => ({
              ...item,
              tumbok: item.tumbok / 100000,
              sahod: item.sahod / 100000,
              ramble: item.ramble / 100000,
            }))
          );

          setLoading(false);
          console.log("Formatted Data ", formattedData);
          // setLoading(false);
        }
      } catch (error) {
        console.log(
          "Error loading BettorsvsBetsPlacedSummary: " +
            (error as Error).message
        );
      }
    };

    fetchData();
    //console.log(`Bettors vs Bets Placed Summary Data: ${data}`);
  }, [params.gameCategoryId]);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">
            Today's Bettor Count by Game Type
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
            slotProps={{ 
            noDataOverlay: { message: 'Summary of Bettors and Bets Placed data will be displayed once available.' },
            legend: { hidden: true } }}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            dataset={data}

            yAxis={[
              {
                scaleType: "band",
                data: data.map((item) => item.draw),
              },
            ]}
            xAxis={[
              {
                label: "Amount (in 100,000 units)",
                min: 0,
                max: 100,
              },
            ]}
            series={addLabelsBets([
              {
                dataKey: "tumbok",
                label: "Tumbok",
                color: "#E5C7FF",
              },
              {
                dataKey: "sahod",
                label: "Sahod",
                color: "#5050A5",
              },
              {
                dataKey: "ramble",
                label: "Ramble",
                color: "#7266C9",
              },
              {
                dataKey: "casas",
                label: "Casas",
                color: "#E5C7FF",
              },
            ])}
          />
        )}
      </div>
    </div>
  );
};

export default ChartBettorsBetTypeSummary;

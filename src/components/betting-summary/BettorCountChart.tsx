import React, { useEffect, useState } from "react";
import { CircularProgress, Button } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchHistoricalSummary } from "~/utils/api/transactions";
import { addLabelsGameTypes } from "./tooltips/dataSet";
import { buttonStyles } from "~/styles/theme";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "~/store/useAuthStore";

// Custom Legend (Dynamically Handles Bet Types)
const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#E5C7FF] mr-2" />
      <p>STL Pares</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-2" />
      <p>STL Swer2</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#7266C9] mr-2" />
      <p>STL Swer3</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#3B3B81] mr-2" />
      <p>STL Swer4</p>
    </div>
  </div>
);

const ChartBettorsSummary = () => {
  const [data, setData] = useState<
    {
      draw: string;
      pares: number;
      swer2: number;
      swer3: number;
      swer4: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const xAxisTicks = [
    0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100,
  ];

  const fetchBettorsVsBetsData = async (setData: Function, setLoading: Function) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetchHistoricalSummary({
        from: today,
        to: today,
      });

      const res = response.data.filter((item: { TransactionDate: string }) =>
        item.TransactionDate.startsWith(today)
      );

      if (response.success && Array.isArray(res)) {
        const aggregatedData: Record<
          number,
          { pares: number; swer2: number; swer3: number; swer4: number }
        > = {};

        response.data.forEach(
          (item: {
            DrawOrder: number;
            TotalBettors: number;
            TotalBets: number;
            GameCategoryId: number;
          }) => {
            if (!aggregatedData[item.DrawOrder]) {
              aggregatedData[item.DrawOrder] = {
                pares: 0,
                swer2: 0,
                swer3: 0,
                swer4: 0,
              };
            }

            aggregatedData[item.DrawOrder].pares +=
              item.GameCategoryId == 1 ? item.TotalBets : 0;
            aggregatedData[item.DrawOrder].swer2 +=
              item.GameCategoryId == 2 ? item.TotalBets : 0;
            aggregatedData[item.DrawOrder].swer3 +=
              item.GameCategoryId == 3 ? item.TotalBets : 0;
            aggregatedData[item.DrawOrder].swer4 +=
              item.GameCategoryId == 4 ? item.TotalBets : 0;
          }
        );

        const formattedData = [
          {
            draw: "First Draw",
            pares: aggregatedData[1]?.pares || 0,
            swer2: aggregatedData[1]?.swer2 || 0,
            swer3: aggregatedData[1]?.swer3 || 0,
            swer4: aggregatedData[1]?.swer4 || 0,
          },
          {
            draw: "Second Draw",
            pares: aggregatedData[2]?.pares || 0,
            swer2: aggregatedData[2]?.swer2 || 0,
            swer3: aggregatedData[2]?.swer3 || 0,
            swer4: aggregatedData[2]?.swer4 || 0,
          },
          {
            draw: "Third Draw",
            pares: aggregatedData[3]?.pares || 0,
            swer2: aggregatedData[3]?.swer2 || 0,
            swer3: aggregatedData[3]?.swer3 || 0,
            swer4: aggregatedData[3]?.swer4 || 0,
          },
        ];

        setData(
          formattedData.map((item) => ({
            ...item,
            pares: item.pares / 100000,
            swer2: item.swer2 / 100000,
            swer3: item.swer3 / 100000,
            swer4: item.swer4 / 100000,
          }))
        );
      }
    } catch (error) {
      console.log(
        "Error loading BettorsvsBetsPlacedSummary: " +
          (error as Error).message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBettorsVsBetsData(setData, setLoading);
  }, []);

  const safeMax = Math.max(
    1000,
    ...data.map((item) => item.pares + item.swer2 + item.swer3 + item.swer4)
  );

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">
            Today's Bettor Count by Game Type
          </p>
          <CustomLegend />
        </div>
        {currentUserType !== 3 && (
          <GenericCSVExportButton
            data={data}
            headers={["Draw", "STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"]}
            title="Summary of Bettors and Bets per Draw"
            getRowData={(item) => [
              item.draw,
              item.pares.toFixed(3),
              item.swer2.toFixed(3),
              item.swer3.toFixed(3),
              item.swer4.toFixed(3),
            ]}
          />
        )}
      </div>

      <div className="h-full w-full">
        {/* {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <CircularProgress />
          </div>
        ) : ( */}
          <BarChart
            height={300}
            // width={{100%}}
            grid={{ vertical: true }}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            slotProps={{
              noDataOverlay: {
                message: "Today's Bettor Count by Game Type data will be displayed once available.",
              },
              legend: { hidden: true },
            }}
            dataset={data}
            series={addLabelsGameTypes([
              {
                dataKey: "pares",
                label: "STL Pares",
                color: "#E5C7FF",
              },
              {
                dataKey: "swer2",
                label: "STL Swer2",
                color: "#5050A5",
              },
              {
                dataKey: "swer3",
                label: "STL Swer3",
                color: "#7266C9",
              },
              {
                dataKey: "swer4",
                label: "STL Swer4",
                color: "#3B3B81",
              },
            ])}
            yAxis={[
              {
                scaleType: "band",
                data: ["First Draw", "Second Draw", "Third Draw"],
              }
            ]}
            xAxis={[
              {
                label: "Total (x 100,000)",
                min: 0,
                max: safeMax,
                valueFormatter: (value: number) => `${value.toLocaleString()}`,
                tickValues: xAxisTicks,
                tickSpacing: 1,
              } as any,
            ]}
          />
        {/* )} */}
      </div>
    </div>
  );
};

export default ChartBettorsSummary;

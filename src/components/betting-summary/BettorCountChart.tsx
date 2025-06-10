import React, { useEffect, useState, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchHistoricalSummary } from "~/utils/api/transactions";
import { addLabelsGameTypes } from "./tooltips/dataSet";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";

// Custom Legend (Dynamically Handles Bet Types)
const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4">
    {[
      { label: "STL Pares", color: "#E5C7FF" },
      { label: "STL Swer2", color: "#5050A5" },
      { label: "STL Swer3", color: "#7266C9" },
      { label: "STL Swer4", color: "#3B3B81" },
    ].map((item) => (
      <div key={item.label} className="flex items-center">
        <div className="w-3.5 h-3.5 rounded-full mr-2" style={{ backgroundColor: item.color }} />
        <p>{item.label}</p>
      </div>
    ))}
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
      [key: string]: string | number; // This is the index signature
    }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const xAxisTicks = [
    0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100,
  ];

  const series = [
    { dataKey: "pares", label: "STL Pares", color: "#E5C7FF" },
    { dataKey: "swer2", label: "STL Swer2", color: "#5050A5" },
    { dataKey: "swer3", label: "STL Swer3", color: "#7266C9" },
    { dataKey: "swer4", label: "STL Swer4", color: "#3B3B81" },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetchHistoricalSummary({ from: today, to: today });

      if (response.success && Array.isArray(response.data)) {
        const filteredData = response.data.filter(
          (item: { TransactionDate: string }) =>
            item.TransactionDate.startsWith(today)
        );

        const aggregated: Record<number, { pares: number; swer2: number; swer3: number; swer4: number }> = {};

        filteredData.forEach(
          (item: {
            DrawOrder: number;
            TotalBets: number;
            GameCategoryId: number;
          }) => {
            const draw = item.DrawOrder;
            if (!aggregated[draw]) {
              aggregated[draw] = { pares: 0, swer2: 0, swer3: 0, swer4: 0 };
            }

            switch (item.GameCategoryId) {
              case 1:
                aggregated[draw].pares += item.TotalBets;
                break;
              case 2:
                aggregated[draw].swer2 += item.TotalBets;
                break;
              case 3:
                aggregated[draw].swer3 += item.TotalBets;
                break;
              case 4:
                aggregated[draw].swer4 += item.TotalBets;
                break;
              default:
                break;
            }
          }
        );

        const formatted = ["First Draw", "Second Draw", "Third Draw"].map(
          (label, index) => {
            const draw = index + 1;
            const current = aggregated[draw] || {
              pares: 0,
              swer2: 0,
              swer3: 0,
              swer4: 0,
            };
            return {
              draw: label,
              pares: current.pares / 100000,
              swer2: current.swer2 / 100000,
              swer3: current.swer3 / 100000,
              swer4: current.swer4 / 100000,
            };
          }
        );

        setData(formatted);
      }
    } catch (error) {
      console.error("Error loading Bettors Summary:", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const maxValue = Math.max(
    ...data.flatMap((item) =>
      series.map(({ dataKey }) => Number(item[dataKey.toLowerCase()] || 0))
    )
  );
  const safeMax = maxValue < 1000 ? 1000 : maxValue;

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">
            Today's Bettor Count by Game Type
          </p>
          <CustomLegend />
        </div>
        <GenericCSVExportButton
          data={data}
          headers={["Draw", "STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"]}
          title="Summary of Bettors and Bets per Draw"
          getRowData={(item) => [
            item.draw,
            item.pares,
            item.swer2,
            item.swer3,
            item.swer4,
          ]}
        />
      </div>

      <div className="h-full w-full">
        {/* {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <CircularProgress />
          </div>
        ) : ( */}
          <BarChart
            height={300}
            layout="horizontal"
            grid={{ vertical: true }}
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            slotProps={{
              legend: { hidden: true },
              noDataOverlay: {
                message: "Today's Bettor Count by Game Type will be displayed once available.",
              },
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
                data: data.map((d) => d.draw),
              } as any,
            ]}
            xAxis={[
              {
                label: "Amount (in 100,000 units)",
                min: 0,
                max: safeMax,
                valueFormatter: (val: number) => val.toLocaleString(),
                tickValues: xAxisTicks,
              } as any,
            ]}
          />
        {/* )} */}
      </div>
    </div>
  );
};

export default ChartBettorsSummary;
